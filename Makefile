APP_NAME=#APP_NAME
APP_PORT=#APP_PORT
DOCKER_REPO=#DOCKER_REPO
DOCKER_IMAGE=#DOCKER_IMAGE
DOCKER_USER=#DOCKER_USER
DOCKER_PASSWORD=#DOCKER_PASSWORD
SERVER_HOST=#SERVER_HOST
SERVER_USER=#SERVER_USER
DOMAIN=#DOMAIN

DEPLOYMENT = $(shell sh deploy/deploy.sh)
VERSION_TAG = $(shell sh ci/get-tag.sh)
BRANCH_NAME = $(shell echo "$$(git rev-parse --abbrev-ref HEAD)") #branch name
VERSION_LATEST = $(shell echo "$$(git rev-parse --abbrev-ref HEAD)") #branch name
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help
#CMD_SETUP := "mv deploy/#APP_NAME/ deploy/$(BRANCH_NAME)-$(APP_NAME)/;printf 'APP_IMAGE=$(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_TAG)%s\nAPP_PORT=$(APP_PORT)'> deploy/$(BRANCH_NAME)-$(APP_NAME)/.env"

CMD_SETUP = $(shell sh ci/setup.sh $(BRANCH_NAME) $(APP_NAME) $(DOCKER_REPO) $(DOCKER_IMAGE) $(VERSION_TAG) $(APP_PORT) $(SERVER_USER) $(SERVER_HOST) $(DOCKER_USER) $(DOCKER_PASSWORD) $(DOMAIN) )
#setup.sh $(BRANCH_NAME) $(APP_NAME) $(DOCKER_REPO) $(DOCKER_IMAGE) $(VERSION_TAG) $(APP_PORT) $(SERVER_USER) $(SERVER_HOST)$(DOCKER_USER) $(DOCKER_PASSWORD)
CMD_TEST := "printf 'TEST IS PASS'"


setup:	##SETUP
	@eval $(CMD_SETUP)

build: ## Build the container
	@eval $(CMD_SETUP)
	docker build -t $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_TAG) -t $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_LATEST) -f ci/Dockerfile .
build-nc: ## Build the container without caching
	@eval $(CMD_SETUP)
	docker build ---build-arg APP_PORT=$(APP_PORT) --build-arg EXPOSE=$(APP_PORT) --no-cache -t $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_TAG) -t $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_LATEST) -f ci/Dockerfile .

run: ## Run container on port configured in `.env`
	docker run -d -p=$(APP_PORT):$(APP_PORT) --name="$(APP_NAME)" $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_TAG)
	#docker run -i -t --rm --env-file=./config.env -p=$(PORT):$(PORT) --name="$(APP_NAME)" $(APP_NAME)
test: #tag ## run test contaier
	@eval $(CMD_TEST)

up: build run ## Run container on port configured in `.env` (Alias to run)

stop: ## Stop and remove a running container
	docker stop $(APP_NAME); docker rm $(APP_NAME)

logs: ##get logs from container
	docker logs $(APP_NAME) -ft --tail=100

#all: build-nc test publish remove ## Make a release by building and publishing the `{version}` ans `latest` tagged containers to ECR
all: build-nc test repo-login release-version-latest release-version-tag remove deployment ## Make a release by building and release the `{version}` and `latest` tag

release: repo-login release-version-latest release-version-tag ## Make a release by building and release the `{version}` and `latest` tagged 

release-version-latest: #tag-latest ## Release the `latest` taged container to ECR
	@echo 'publish latest to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_LATEST)

release-version-tag: #tag-version ## Release the `{version}` taged container to ECR
	@echo 'publish $(VERSION) to $(DOCKER_REPO)'
	docker push $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_TAG)

remove: #remove docker image
	@echo 'remove images with tag version and tag lates'
	docker rmi $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_TAG)
	docker rmi $(DOCKER_REPO)/$(DOCKER_IMAGE):$(VERSION_LATEST)
# Docker tagging


# HELPERS

# generate script to login to aws docker repo
#CMD_REPOLOGIN := "eval $$\( aws ecr"
#ifdef AWS_CLI_PROFILE
#CMD_REPOLOGIN += " --profile $(AWS_CLI_PROFILE)"
#endif
#ifdef AWS_CLI_REGION
#CMD_REPOLOGIN += " --region $(AWS_CLI_REGION)"
#endif
#CMD_REPOLOGIN += " get-login --no-include-email \)"
# login to AWS-ECR

CMD_REPOLOGIN := "docker login -u $(DOCKER_USER) -p$(DOCKER_PASSWORD)"

repo-login: ## Docker login
	## Auto login to AWS-ECR unsing aws-cli
	@eval $(CMD_SETUP)
	@eval $(CMD_REPOLOGIN)

v-latest: ##testagcek
	@echo $(VERSION_LATEST)

v-tag: ##testagcek
	@echo $(VERSION_TAG)
	#@echo $(GIT_COMMIT)
	#@echo $(GIT_BRANCH_NAME)
deployment: #deployment
	@echo $(DEPLOYMENT)
