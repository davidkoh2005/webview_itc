import React, { Component } from 'react';
import './style.less'
import { Card, CardBody, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import constant from './../../config/constant'

export default class FooterBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.value,
            isValidEmail: true
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { email } = this.state;
        const { onChange } = this.props;
        if (email !== prevState.email) onChange(email);
    }

    change = (e) => {
        let valid = true
        if(e.target.value && e.target.value != ""){
           let regex = e.target.value.match(constant.REGEX_EMAIL)
           valid = regex == null ? false : true
        }
        this.setState({ email: e.target.value, isValidEmail: valid });
    }

    render() {
        let { backButton, submitPayment, textFooter = "LIHAT NOMOR REKENING", value="", onChange } = this.props
        let {email, isValidEmail} = this.state
        return (
            <React.Fragment>
                <div className="footer-bank">
                    <Card>
                        <CardBody className="footer-text">
                            Kirim instruksi pembayaran ke email Anda ?
                        </CardBody>
                    </Card>
                    <Input className="input-email" onChange={this.change} value={email} type="email" name="email" id="exampleEmail" placeholder="Email" />
                </div>
                <div className="footer-payment">
                    <div className="footer-button">
                        <button onClick={() => backButton()} className="back-button">
                            <FontAwesomeIcon icon={faArrowLeft} size={"lg"} />
                        </button>
                        <div className="line-button"></div>
                        <button
                            onClick={() => submitPayment()}
                            className="submit-button"
                            disabled={!isValidEmail}
                        >
                            {textFooter}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
