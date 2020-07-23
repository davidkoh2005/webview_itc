'use strict';
import axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert'
import React from 'react';
import constant from './../config/constant';

export default class IndexCtrl extends React.Component {
    constructor(element) {
        super();
        this.element = element;
    }

    headerToken() {
        const _this = this
        let profile = _this.element.state.profile
        let header = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Locale': 'en',
                'Signature': profile.signature
            }
        }
        return header;
    }

    headerTokenJson() {
        const _this = this
        let profile = _this.element.state.profile
        let header = {
            headers: {
                'Accept': 'application/json',
                'Signature': profile.signature
            }
        }
        return header;
    }

    getValidateWeb() {
        const _this = this
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        var bodyFormData = new FormData();
        let profile = _this.element.state.profile
        bodyFormData.set('OrderNumber', profile.orderNumber);
        axios.post(constant.URL_MASTER_PATH + constant.URL_VALIDATE_WEB_VIEW, bodyFormData, this.headerToken())
            .then(res => {
                let isValidate = _this.element.state.isValidate
                if (res.status == 200) {
                    isValidate = !res.data.data.is_expired

                    if (isValidate == true) {
                        _this.element.setState({ isValidate })
                        _this.getData();
                    }
                    else {
                        isLoading = false
                    }
                }
                else {
                    isValidate = false
                }
                _this.element.setState({ isLoading, isValidate })

            })
            .catch(function (error) {
                let isValidate = _this.element.state.isValidate
                let isLoading = _this.element.state.isLoading
                isLoading = false
                isValidate = false
                _this.element.setState({ isLoading, isValidate })
            });
    }

    getData() {
        const _this = this
        var bodyFormData = new FormData();
        let profile = _this.element.state.profile
        bodyFormData.set('OrderNumber', profile.orderNumber);
        axios.post(constant.URL_MASTER_PATH + constant.URL_INITIATE_WEB, bodyFormData, this.headerToken())
            .then(res => {
                if (res && res.data.status_code == 200) {
                    let data = res.data.data
                    let tempInitial = Object.assign({}, _this.element.state.tempInitial)
                    let merchant = Object.assign({}, _this.element.state.merchant)
                    let totalPrice = Object.assign({}, _this.element.state.totalPrice)
                    let orderDetail = _this.element.state.orderDetail
                    let customerDetail = Object.assign({}, _this.element.state.customerDetail)

                    tempInitial = data

                    merchant.id = data.merchant.id
                    merchant.name = data.merchant.name
                    merchant.orderID = data.number
                    merchant.referenceNumber = data.reference_number
                    merchant.transID = data.id

                    totalPrice.price = data.amount
                    totalPrice.currency = data.currency

                    let tempOrderDetail = data.description
                    tempOrderDetail.map(x => {
                        let bodyDetail = {
                            items: x.Desc,
                            amount: x.Amount,
                            currency: data.currency
                        }
                        orderDetail.push(bodyDetail)
                    })
                    // orderDetail.items = data.description
                    // orderDetail.amount = data.amount
                    // orderDetail.currency = data.currency
                    if (data.user) {
                        let user = data.user
                        customerDetail.name = user.name ? user.name : ""
                        let contact = user.contact ? user.contact : ""

                        contact = contact.split(";");

                        customerDetail.phone = contact[0] ? contact[0] : ""
                        customerDetail.email = contact[1] ? contact[1] : ""
                        customerDetail.isDisabledName = customerDetail.name == "" ? false : true
                        customerDetail.isDisabledPhone = customerDetail.phone == "" ? false : true
                        customerDetail.isDisabledEmail = customerDetail.email == "" ? false : true
                    }

                    _this.element.setState({ tempInitial, merchant, totalPrice, orderDetail, customerDetail })
                }

                let isLoading = _this.element.state.isLoading
                isLoading = false
                _this.element.setState({ isLoading })
            })
            .catch(function (error) {
                if (error.response) {
                    swal({
                        text: error.response.data.message,
                        icon: "error",
                        timer: 3000,
                        button: false,
                    });
                }
                let isLoading = _this.element.state.isLoading
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitFormCustomer() {
        const _this = this
        var bodyFormData = new FormData();
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        let customerDetail = _this.element.state.customerDetail
        let profile = _this.element.state.profile
        bodyFormData.set('OrderNumber', profile.orderNumber);
        bodyFormData.set('PayerName', customerDetail.name);
        bodyFormData.set('PayerPhone', customerDetail.phone);
        bodyFormData.set('PayerEmail', customerDetail.email);

        axios.post(constant.URL_MASTER_PATH + constant.URL_PAY_NOW, bodyFormData, this.headerToken())
            .then(res => {
                if (res.status == 200) {
                    let emailBlasting = _this.element.state.emailBlasting
                    emailBlasting = customerDetail.email

                    _this.element.setState({ emailBlasting }, () => {
                        this.getChannelMenu()
                    });

                }
                else {
                    isLoading = false
                    _this.element.setState({ isLoading })
                    swal({
                        text: res.message,
                        icon: "error",
                        timer: 2000,
                        button: false,
                    });
                }
            })
            .catch(function (error) {
                if (error.response) {
                    swal({
                        text: error.response.data.message,
                        icon: "error",
                        timer: 3000,
                        button: false,
                    });
                }
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    getChannelMenu() {
        const _this = this
        var bodyFormData = new FormData();
        let profile = _this.element.state.profile
        let isLoading = _this.element.state.isLoading
        bodyFormData.set('OrderNumber', profile.orderNumber);
        axios.post(constant.URL_MASTER_PATH + constant.URL_GET_CHANNEL, bodyFormData, this.headerToken())
            .then(res => {
                if (res.status == 200) {
                    let paymentMethodList = _this.element.state.paymentMethodList
                    paymentMethodList = res.data.data
                    isLoading = false
                    _this.element.setState({ paymentMethodList, choosePayment: true, isLoading })
                }
                else {
                    isLoading = false
                    _this.element.setState({ isLoading })
                    swal({
                        text: res.message,
                        icon: "error",
                        timer: 2000,
                        button: false,
                    });
                }
            })
            .catch(function (error) {
                if (error.response) {
                    swal({
                        text: error.response.data.message,
                        icon: "error",
                        timer: 3000,
                        button: false,
                    });
                }
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitChannelMenu(data) {
        const _this = this
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        var bodyFormData = new FormData();
        let profile = _this.element.state.profile
        bodyFormData.set('OrderNumber', profile.orderNumber);
        bodyFormData.set('MenuId', data.page_id);
        axios.post(constant.URL_MASTER_PATH + constant.URL_SUBMIT_CHANNEL, bodyFormData, this.headerToken())
            .then(res => {
                if (res.status == 200) {
                    let choosePayment = _this.element.state.choosePayment
                    let paymentMethod = _this.element.state.paymentMethod

                    paymentMethod = data;
                    choosePayment = false;
                    isLoading = false
                    _this.element.setState({ paymentMethod, choosePayment, isLoading })
                }
                else {
                    isLoading = false
                    _this.element.setState({ isLoading })
                    swal({
                        text: res.message,
                        icon: "error",
                        timer: 2000,
                        button: false,
                    });
                }
            })
            .catch(function (error) {
                if (error.response) {
                    swal({
                        text: error.response.data.message,
                        icon: "error",
                        timer: 3000,
                        button: false,
                    });
                }
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitPaymentVA() {
        const _this = this
        var bodyFormData = new FormData();
        let merchant = _this.element.state.merchant
        let profile = _this.element.state.profile
        let paymentMethod = _this.element.state.paymentMethod
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        bodyFormData.set('OrderNumber', profile.orderNumber);
        bodyFormData.set('TrxId', merchant.transID);
        bodyFormData.set('PaymentMethod', paymentMethod.id);
        bodyFormData.set('PaymentChannel', paymentMethod.page_id);

        axios.post(constant.URL_MASTER_PATH + constant.URL_ATM_BERSAMA, bodyFormData, this.headerToken())
            .then(res => {
                if (res.status == 200) {
                    let showRekening = _this.element.state.showRekening
                    let bankVA = Object.assign({}, _this.element.state.bankVA)
                    let data = res.data.data
                    showRekening = true
                    bankVA.nomorRekening = data.vaNo
                    bankVA.expiredDate = data.expiredDate
                    isLoading = false
                    _this.element.setState({ showRekening, bankVA, isLoading })
                }
                else {
                    isLoading = false
                    _this.element.setState({ isLoading })
                    swal({
                        text: res.message,
                        icon: "error",
                        timer: 2000,
                        button: false,
                    });
                }
            })
            .catch(function (error) {
                if (error.response) {
                    let showRekening = _this.element.state.showRekening
                    let bankVA = Object.assign({}, _this.element.state.bankVA)
                    let data = error.response.data ? error.response.data.message : null
                    if (data) {
                        swal({
                            text: data.errDesc,
                            icon: "error",
                            timer: 2000,
                            button: false,
                        });
                        let bankData = data.data ? data.data : null
                        if (bankData) {
                            showRekening = true
                            bankVA.nomorRekening = bankData.brivaNo + bankData.custCode
                            bankVA.expiredDate = bankData.expiredDate
                            _this.element.setState({ showRekening, bankVA })
                        }

                    }
                }
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitPaymentBriva() {
        const _this = this

        let profile = _this.element.state.profile
        let emailBlasting = _this.element.state.emailBlasting
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        let body = {
            "OrderNumber": profile.orderNumber,
            "Email": emailBlasting
        }

        // let url = "http://172.1.10.2:8777/api/webview/payment/bri-va"
        let url = constant.URL_MASTER_PATH + constant.URL_SUBMIT_BRIVA
        axios.post(url, body, this.headerTokenJson())
            .then(res => {
                if (res.status == 200) {
                    let showRekening = _this.element.state.showRekening
                    let bankVA = Object.assign({}, _this.element.state.bankVA)
                    let data = res.data.data
                    showRekening = true
                    bankVA.nomorRekening = data.pay.number
                    bankVA.expiredDate = moment(data.date_update).add(1, 'd');
                    isLoading = false
                    _this.element.setState({ showRekening, bankVA, isLoading })
                }
            })
            .catch(function (error) {
                if (error.response) {
                    let data = error.response.data ? error.response.data.message : null
                    let isAlready = error.response.data ? error.response.data.errors : null
                    if (data) {
                        swal({
                            text: data,
                            icon: "error",
                            timer: 2000,
                            button: false,
                        });

                    }
                    else if (isAlready) {
                        data = isAlready
                        let showRekening = _this.element.state.showRekening
                        let bankVA = Object.assign({}, _this.element.state.bankVA)
                        let bankData = data.data ? data.data : null
                        if (bankData) {
                            showRekening = true
                            bankVA.nomorRekening = bankData.brivaNo + bankData.custCode
                            bankVA.expiredDate = bankData.expiredDate
                            _this.element.setState({ showRekening, bankVA })
                        }
                    }
                }
                else{
                    swal({
                        text: "ERROR",
                        icon: "error",
                        timer: 2000,
                        button: false,
                    });
                }
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitBRIEpay(data = null) {

    }

    submitBCAclickpay(data = null) {

    }

    submitMandiriBillPay(data = null) {

    }

    submitpaymentCreditCard(data) {
        const _this = this

        let isLoading = _this.element.state.isLoading
        let totalPrice = _this.element.state.totalPrice
        isLoading = true
        _this.element.setState({ isLoading })

        var key = constant.KEY_CC;
        var encodeKey = btoa(key);

        var body = {
            "is_single_use": true,
            "card_data": {
                "account_number": data.UserCardNumber,
                "exp_month": data.ExpiredMonth,
                "exp_year": data.ExpiredYear,
                "cvn": data.CvcCvv2
            },
            "should_authenticate": true,
            "amount": totalPrice.price,
            "card_cvn": data.CvcCvv2
        }

        let header = {
            headers: {
                'Content-Type': 'application/json',
                'authorization': "Basic " + encodeKey
            }
        }

        axios.post(constant.URL_CC, body, header)
            .then(res => {
                if (res.status == 200) {
                    let status = res.data.status;

                    if (status === 'VERIFIED') {
                        // Penanangan keberhasilan
                    } else if (status === 'IN_REVIEW') {
                        let urlIframeCC = _this.element.state.urlIframeCC
                        urlIframeCC = res.data.payer_authentication_url
                        _this.element.setState({ urlIframeCC })
                    } else if (status === 'FAILED') {
                        swal({
                            text: "FAILED GET CC",
                            icon: "error",
                            timer: 2000,
                            button: false,
                        });
                    }
                    isLoading = false
                    _this.element.setState({ isLoading })
                }
            })
            .catch(function (error) {
                if (error.response) {
                    let data = error.response.data ? error.response.data : null
                    if (data) {
                        let errorList = data.errors
                        let errorMessage = ""
                        errorList.map(x => {
                            if(x.messages && x.messages.length != 0){
                                errorMessage = x.messages[0]
                                // break;
                            }
                        })
                        swal({
                            text: errorMessage,
                            icon: "error",
                            timer: 2000,
                            button: false,
                        });
                    }
                }
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    postApiCreditCard(data) {
        const _this = this

        let isLoading = _this.element.state.isLoading
        let merchant = _this.element.state.merchant
        isLoading = true
        _this.element.setState({ isLoading })
        // window.location.href = "/backtoapps"
        // axios.post(constant.URL_MASTER_PATH + constant.URL_CC_SUBMIT_API, body, {})
        data['order_id'] = merchant.transID.toString();
        axios.post(constant.URL_MASTER_PATH + constant.URL_CC_SUBMIT_API, data, {})
            .then(res => {
                window.location.href = "/backtoapps"
            })
            .catch(function (error) {
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitBCAVA(data = null) {

    }

    submitBNIVA(data = null) {

    }

    submitLinkAja(data) {
        let _this = this
        let merchant = _this.element.state.merchant
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        let body = {
            "trxId": merchant.transID.toString(),
            "uuid": merchant.transID.toString(),
        }

        axios.post(constant.URL_MASTER_PATH + constant.URL_LINK_AJA_WORKFLOW, body, {})
            .then(res => {
                let showRekening = _this.element.state.showRekening
                isLoading = false
                showRekening = true
                _this.element.setState({ isLoading, showRekening })
            })
            .catch(function (error) {
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitOvo(data) {
        let _this = this
        let profile = _this.element.state.profile
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        let body = {
            "trxNo": profile.orderNumber,
            "paymentType": "OVO",
            "trxUserContact": data
        }
        axios.post(constant.URL_MASTER_PATH + constant.URL_ESPAY, body, {})
            .then(res => {
                let showRekening = _this.element.state.showRekening
                let data = res.data.data.Response
                if (data.error_code != "0000") {
                    swal({
                        text: data.error_message,
                        icon: "error",
                        timer: 2000,
                        button: false,
                    });
                    showRekening = false
                    if (data.error_code == "0602") {
                        showRekening = true
                    }
                }
                else {
                    showRekening = true
                }
                isLoading = false

                _this.element.setState({ isLoading, showRekening })
            })
            .catch(function (error) {
                swal({
                    text: "CONNECTION TIME OUT",
                    icon: "error",
                    timer: 2000,
                    button: false,
                });
                isLoading = false
                _this.element.setState({ isLoading })
            });
    }

    submitIndomaret() {
    }

    submitQRIS() {
    }

    submitVAMandiri() {
    }

    submitVABNI() {

    }
}