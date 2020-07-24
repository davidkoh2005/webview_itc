import React, { Component, createRef } from 'react';
import './index.less'
import Header from './Shared/Header'
import { Card, CardBody, Row, Col, Input, Form, FormGroup, Label, Modal, ModalBody } from "reactstrap";
import BlockUi from 'react-block-ui';
import './block-ui.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Dropzone from 'react-dropzone';
import IndexCtrl from './../controllers/index';
import swal from 'sweetalert';
import constant from './../config/constant'
import NotFoundPage from './NotFoundPage'
import RedirectPath from './RedirectPath'
import NumberFormat from 'react-number-format';

import upload_logo from './../assets/upload_logo.png';


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
            selectedTab: 0,
            showRekening: false,
            isLoading: false,
            isValidate: true,
            isOnline: true,
            emailBlasting: "",
            isDone: false,
            urlIframeCC: '',

            gambar: '',
            file: [],
            blopURL: ''
        };
        this.Ctrl = new IndexCtrl(this);

    }

    componentDidMount() {
        let { profile } = this.state

        const url = window.location.href;
        let pathname = url.split("web/");
        let pathDirect = window.location.pathname

        if (pathDirect == "/backtoapps") {
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
                    this.Ctrl.getData()
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
            this.Ctrl.postBukti()
        }
    }

    handleImage = (event, prop) => {
        let { gambar, file, blopURL } = this.state

        if (prop.length == 0) {
            gambar = event[0].name;
            file = event[0];
            blopURL = URL.createObjectURL(file)

            this.setState({ gambar, file, blopURL })
        }
        else {
            if (prop[0].errors[0].code == "file-too-large") {
                swal({
                    text: "Max File 5MB",
                    icon: "error",
                });
            }
            else if (prop[0].errors[0].code == "file-invalid-type") {
                swal({
                    text: "Invalid File Format",
                    icon: "error",
                });
            }
        }
    }

    render() {
        let { isDone, customerDetail, totalPrice, merchant, orderDetail, tabsList, selectedTab, isLoading, isValidate, isOnline, blopURL, gambar, file } = this.state

        let tempPath = blopURL == '' ? upload_logo : blopURL;
        const changeStyle = {
            display: 'none'
        };
        let dropzoneRef = createRef()
        const style = {
            height: 100,
            width: 100,
            margin: 20,
            textAlign: 'center',
            display: 'inline-block'
        };
        console.log(tempPath)
        return (
            <React.Fragment>
                {isDone == false ? (
                    <React.Fragment>
                        {isValidate == true ? (
                            <BlockUi tag="div" blocking={isLoading} message="Loading, please wait...">

                                <div className="containers-body">
                                    <div style={{ overflowY: "scroll" }}>
                                        <Header title="Rincian Transaksi" merchant={merchant} totalPrice={totalPrice} />
                                        <div className="body-content">
                                            <Card style={{ borderRadius: 10, marginBottom: 40 }}>
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

                                                    <Dropzone
                                                        multiple={false}
                                                        accept='image/jpeg, image/jpg, image/png'
                                                        onDrop={this.handleImage.bind(this)}
                                                        name={'Image'}
                                                        maxSize={5120000}
                                                        ref={dropzoneRef}>
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps()} className='image-container'>
                                                                <input {...getInputProps()} />
                                                                <div className="image-uploader">
                                                                    <div
                                                                        className='image-drop'
                                                                        style={{
                                                                            backgroundImage: `url('${tempPath || tempPath}')`
                                                                        }}
                                                                    ></div>
                                                                    <div style={blopURL == "" ? { display: "inherit" } : { display: "none" }} className="image-text">Upload your image here</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Dropzone>

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
                                                    SUBMIT BUKTI PEMBAYARAN
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