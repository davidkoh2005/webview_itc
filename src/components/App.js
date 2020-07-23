import React, { Component } from 'react';
import './index.less'
import Header from './Shared/Header'
import FooterBank from './Shared/FooterBank'
import ChoosePayment from './Shared/ChoosePayment'
import { withRouter } from 'react-router-dom';
import { Card, CardBody, Row, Col, Input, Form, FormGroup, Label, Modal, ModalBody } from "reactstrap";
import BlockUi from 'react-block-ui';
import './block-ui.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import IndexCtrl from './../controllers/index';
import swal from 'sweetalert';
import constant from './../config/constant'
import NotFoundPage from './NotFoundPage'
import RedirectPath from './RedirectPath'
import NumberFormat from 'react-number-format';

class AppsComponents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempInitial: null,
            totalPrice: {
                price: 0,
                currency: ''
            },
            profile: {
                orderNumber: '',
                signature: ''
            },
            merchant: {
                id: "",
                name: "",
                orderID: "",
                referenceNumber: "",
                transID: ""
            },
            orderDetail: [],
            customerDetail: {
                name: "",
                messageName: "",
                phone: "",
                messagePhone: "",
                email: "",
                messageEmail: "",
                messageAll: "",
                isDisabled: false,
                isDisabledName: false,
                isDisabledPhone: false,
                isDisabledEmail: false
            },
            tabsList: [
                {
                    id: 0,
                    text: 'Order Details'
                },
                {
                    id: 1,
                    text: 'Customers Details'
                },
            ],
            bankVA: {
                nomorRekening: '',
                expiredDate: ''
            },
            paymentMethodList: [],
            selectedTab: 0,
            choosePayment: false,
            paymentMethod: null,
            showRekening: false,
            isLoading: false,
            isValidate: true,
            isOnline: true,
            emailBlasting: "",
            isDone: false,
            urlIframeCC: ''
        };
        this.Ctrl = new IndexCtrl(this);

    }

    componentDidMount() {
        let { profile } = this.state

        const url = window.location.href;
        let pathname = url.split("web/");
        let pathDirect = window.location.pathname
        let pathParam = window.location.search

        let isRedirectLinkAja = pathParam.includes("https://sandbox-kit.espay.id")

        if (isRedirectLinkAja == true) {
            this.setState({ isDone: true })
        }
        else if (pathDirect == "/backtoapps") {
            this.setState({ isDone: true })
        }
        else if (pathname.length == 1) {
            swal({
                text: "Order Number Not Found",
                icon: "error",
            });
        }
        else {
            let params = pathname[pathname.length - 1].split("?s=")
            if (params.length == 1) {
                swal({
                    text: "Signature Not Found",
                    icon: "error",
                });
            }
            else {
                profile.orderNumber = params[0]
                profile.signature = params[1]

                this.setState({ profile }, () => {
                    this.Ctrl.getValidateWeb()
                    // this.Ctrl.getData()
                });
            }
        }

        window.addEventListener('offline', () => {
            this.setState({ isOnline: false })
        });
        window.addEventListener('online', () => { this.setState({ isOnline: true }) });

    }

    redirectFinish = () => {
        window.location.href = "/backtoapps"
    }

    choosePaymentMethod = (data, id = null) => {
        let datas = data
        if (id) {
            datas['id'] = id
        }
        console.log(datas)
        this.Ctrl.submitChannelMenu(datas)
    }


    submitApiCC = (data) => {
        this.Ctrl.postApiCreditCard(data)
    }

    customerDetailChange = (prop, event) => {
        let customerDetail = this.state.customerDetail
        customerDetail[prop] = event.target.value
        if (prop == "name") {
            if (customerDetail[prop] == "") {
                customerDetail.messageName = "*Nama wajib diisi";
            }
            else if (!(customerDetail[prop].match(constant.REGEX_CHAR_ONLY))) {
                customerDetail.messageName = "*Nama tidak sesuai";
            }
            else {
                customerDetail.messageName = "";
            }
        }
        if (prop == "phone") {
            if (customerDetail[prop] == "") {
                customerDetail.messagePhone = "*Nomor Handphone wajib diisi";
            }
            else if (!(customerDetail[prop].match(constant.REGEX_PHONE_NUMBER))) {
                customerDetail.messagePhone = "*Nomor Handphone tidak sesuai";
            }
            else {
                customerDetail.messagePhone = "";
            }
        }
        if (prop == "email") {
            if (customerDetail[prop] == "") {
                customerDetail.messageEmail = "*Email wajib diisi";
            }
            else if (!(customerDetail[prop].match(constant.REGEX_EMAIL))) {
                customerDetail.messageEmail = "*Email tidak sesuai";
            }
            else {
                customerDetail.messageEmail = "";
            }
        }
        this.setState({ customerDetail })
    }

    openPaymentMethod = () => {
        let { name, phone, email, messageEmail, messagePhone, messageName, isDisabled } = this.state.customerDetail
        let { customerDetail } = this.state
        if (name == "" && phone == "" && email == "") {
            customerDetail.messageName = "*Nama wajib diisi";
            customerDetail.messagePhone = "*Nomor Handphone wajib diisi";
            customerDetail.messageEmail = "*Email wajib diisi";
            customerDetail.messageAll = "*Data harus dilengkapi terlebih dahulu"
            this.setState({ selectedTab: 1, customerDetail })
        }
        else if (name == "" || phone == "" || email == "") {
            if (name == "") {
                customerDetail.messageName = "*Nama wajib diisi";
            }
            if (phone == "") {
                customerDetail.messagePhone = "*Nomor Handphone wajib diisi";
            }
            if (email == "") {
                customerDetail.messageEmail = "*Email wajib diisi";
            }
            this.setState({ selectedTab: 1, customerDetail })
        }
        else if (messageEmail != "" || messageName != "" || messagePhone != "") {
            customerDetail.messageAll = "*Silahkan cek kembali data diri anda"
            this.setState({ selectedTab: 1, customerDetail })
        }
        else {
            this.Ctrl.submitFormCustomer()
        }
    }

    changeEmailBlast = (value) => {
        this.setState({ emailBlasting: value })
    }

    render() {
        let { isDone, customerDetail, totalPrice, merchant, orderDetail, tabsList, selectedTab, choosePayment, paymentMethod, paymentMethodList, isLoading, isValidate, isOnline } = this.state

        return (
            <React.Fragment>
                {isDone == false ? (
                    <React.Fragment>
                        {isValidate == true ? (
                            <BlockUi tag="div" blocking={isLoading} message="Loading, please wait...">

                                <div className="containers-body">
                                    <div style={{ overflowY: "scroll" }}>
                                        <Header title="Rincian Belanja" merchant={merchant} totalPrice={totalPrice} />
                                        <div className="body-content">
                                            <Card style={{ borderRadius: 10, marginBottom: 20 }}>
                                                <CardBody>
                                                    <Row xs={tabsList.length}>
                                                        {tabsList.map((tab, index) => (
                                                            <div key={index}>
                                                                <div onClick={() => this.setState({ selectedTab: tab.id })} className={`tabs-title ${selectedTab == tab.id ? 'active' : ''}`}>{tab.text}</div>
                                                            </div>
                                                        ))}
                                                    </Row>
                                                    {selectedTab == 0 && (
                                                        <React.Fragment>
                                                            <div style={{ padding: '10px 10px 10px 0px' }}>
                                                                <table className="table-order-detail">
                                                                    <thead>
                                                                        <tr>
                                                                            <td className="label">
                                                                                ITEM(S)
                                                                            </td>
                                                                            <td style={{ textAlign: 'right' }} className="label">
                                                                                AMOUNT
                                                                            </td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {orderDetail.map((x, index) => (
                                                                            <tr key={index}>
                                                                                <td className="detail-info">
                                                                                    {x.items}
                                                                                </td>
                                                                                <td style={{ textAlign: 'right' }} className="detail-info">
                                                                                    {x.currency}
                                                                                    <NumberFormat
                                                                                        value={x.amount}
                                                                                        displayType={'text'}
                                                                                        thousandSeparator
                                                                                        prefix={'  '}
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </React.Fragment>
                                                    )}

                                                    {selectedTab == 1 && (
                                                        <React.Fragment>
                                                            <div className="customer-detail">
                                                                <div className="error-message-all">{customerDetail.messageAll}</div>
                                                                <Form>
                                                                    <FormGroup style={{ marginBottom: 5 }}>
                                                                        <div className="label-layout">
                                                                            <Label style={customerDetail.messageName != "" ? { color: 'red' } : {}} className="label-class" for="name">Nama</Label>
                                                                            <div className="error-message">{customerDetail.messageName}</div>
                                                                        </div>
                                                                        <Input type="text" name="name" id="name" placeholder="Contoh: Alvian Maulana" value={customerDetail.name} onChange={this.customerDetailChange.bind(this, 'name')} disabled={customerDetail.isDisabledName} />
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: 5 }}>
                                                                        <div className="label-layout">
                                                                            <Label style={customerDetail.messagePhone != "" ? { color: 'red' } : {}} className="label-class" for="name">Nomor Handphone</Label>
                                                                            <div className="error-message">{customerDetail.messagePhone}</div>
                                                                        </div>
                                                                        <Input type="number" name="phone" id="phone" placeholder="Contoh: 081317651235" value={customerDetail.phone} onChange={this.customerDetailChange.bind(this, 'phone')} disabled={customerDetail.isDisabledPhone} />
                                                                    </FormGroup>
                                                                    <FormGroup style={{ marginBottom: 5 }}>
                                                                        <div className="label-layout">
                                                                            <Label style={customerDetail.messageEmail != "" ? { color: 'red' } : {}} className="label-class" for="name">Email</Label>
                                                                            <div className="error-message">{customerDetail.messageEmail}</div>
                                                                        </div>
                                                                        <Input type="email" name="email" id="email" placeholder="Contoh: alvian@qoin.id" value={customerDetail.email} onChange={this.customerDetailChange.bind(this, 'email')} disabled={customerDetail.isDisabledEmail} />
                                                                    </FormGroup>
                                                                </Form>
                                                            </div>
                                                        </React.Fragment>
                                                    )}

                                                </CardBody>
                                            </Card>
                                        </div>
                                        <div className="footer-content">
                                            <div className="footer-button">
                                                <button onClick={() => this.redirectFinish()} className="back-button">
                                                    <FontAwesomeIcon icon={faTimes} size={"lg"} />
                                                </button>
                                                <div className="line-button"></div>
                                                <button
                                                    className="submit-button"
                                                    type="button"
                                                    onClick={() => this.openPaymentMethod()}
                                                >
                                                    PILIH METODE PEMBAYARAN
                                                        </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </BlockUi>) :
                            (
                                <div className="containers-body">
                                    <NotFoundPage />
                                </div>
                            )}
                        <Modal className="offline-dialog" isOpen={!isOnline}>
                            <ModalBody>
                                <div className="text-offline">
                                    Koneksi Gagal, Mohon Cek Koneksi Anda
                           </div>
                            </ModalBody>
                        </Modal>
                    </React.Fragment >) :
                    (
                        <BlockUi tag="div" blocking={true} message="Loading, please wait...">
                            <div className="containers-body">
                                <RedirectPath />
                            </div>
                        </BlockUi>
                    )}
            </React.Fragment >
        )
    }
}
export default AppsComponents