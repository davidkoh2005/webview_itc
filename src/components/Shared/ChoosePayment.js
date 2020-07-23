import logo from "../../assets/qoin-logo.png";

import React, { Component } from 'react';
import './style.less'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Card, CardBody, Row, Col } from "reactstrap";

export default class ChoosePayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowChild: false,
            currentPayment: [],
            id: null
        }
    }

    chooseChild = (data ,ids) => {
        let { currentPayment, isShowChild, id } = this.state
        isShowChild = true
        currentPayment = data
        id = ids
        this.setState({ isShowChild, currentPayment, id })
    }


    render() {
        let { isShowChild, currentPayment, id } = this.state
        let { onClose, onChoose, paymentMethodList } = this.props
        return (
            <div className="containers-payments">
                <div className="header-payments">
                    <div style={{ display: 'flex', marginLeft: '-10px' }}>
                        <button onClick={isShowChild == false ? () => onClose() : () => this.setState({ isShowChild: false, currentPayment: [] })} className="auto-margin" style={{ border: "none", backgroundColor: 'transparent', marginRight: '10px', color: 'white' }}>
                            <FontAwesomeIcon icon={faArrowLeft} size={"lg"} />
                        </button>
                        <div style={{ color: 'white', fontWeight: '900', letterSpacing: 1 }} className="auto-margin">
                            PILIH PEMBAYARAN
                        </div>
                    </div>
                    <div className="image-title">
                        <img src={logo} alt="korlantas-logo" />
                    </div>
                </div>
                <div className="content-payments">
                    <Card style={{ borderRadius: 10, border: 'none' }}>
                        <CardBody style={{ padding: '0px' }}>
                            {paymentMethodList && isShowChild == false && paymentMethodList.map((payment, index) => (
                                <div key={index} onClick={payment.page_id == null ? () => this.chooseChild(payment.payment_channels, payment.id) : () => onChoose(payment)} style={paymentMethodList.length - 1 != index ? { borderBottom: '3px solid #F7F7F7', cursor: 'pointer' } : { cursor: 'pointer' }}>
                                    <Row style={{ padding: '20px' }}>
                                        <Col className="icon_payment" xs="2">
                                            <img style={{ width: 40, maxHeight: 40 }} src={payment.picture.url} alt={payment.name} />
                                        </Col>
                                        <Col xs="8" className="icon_payment" >
                                            <div className="title-payment">
                                                {payment.name}
                                            </div>
                                            {/* <div className="desc-payment">
                                                {payment.desc}
                                            </div> */}
                                        </Col>
                                        <Col className="icon_payment" xs="1">
                                            <FontAwesomeIcon icon={faAngleRight} size={"lg"} />
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            {currentPayment && isShowChild == true && currentPayment.map((payment, index) => (
                                <div key={index} onClick={() => onChoose(payment, id)} style={currentPayment.length - 1 != index ? { borderBottom: '3px solid #F7F7F7', cursor: 'pointer' } : { cursor: 'pointer' }}>
                                    <Row style={{ padding: '20px' }}>
                                        <Col className="icon_payment" xs="2">
                                            <img style={{ width: 40, maxHeight: 40 }} src={payment.picture.url} alt={payment.name} />
                                        </Col>
                                        <Col xs="8" className="icon_payment">
                                            <div className="title-payment">
                                                {payment.name}
                                            </div>
                                            {/* <div className="desc-payment">
                                                {payment.desc}
                                            </div> */}
                                        </Col>
                                        <Col className="icon_payment" xs="1">
                                            <FontAwesomeIcon icon={faAngleRight} size={"lg"} />
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }
}