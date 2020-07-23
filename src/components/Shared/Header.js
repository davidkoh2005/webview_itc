import logo from "../../assets/qoin-logo.png";
import React, { Component } from 'react';
import './style.less'
import NumberFormat from 'react-number-format';
import { Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default class CreditCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let { totalPrice, merchant, title, isAlert, alertMessage = "", alertIcon = true } = this.props
        return (
            <div style={isAlert == true ? { marginBottom: 30 } : {}} className="header-content">
                <div className="title">
                    <div className="text-title">
                        {title}
                    </div>
                    <div className="image-title">
                        <img src={logo} alt="korlantas-logo" />
                    </div>
                </div>
                <div className="price">
                    <div className="price-text">
                        Jumlah Total
                    </div>
                    <div className="price-nominal">
                        <div style={{ textTransform: 'uppercase' }}>
                            {totalPrice.currency}
                            <NumberFormat
                                value={totalPrice.price}
                                displayType={'text'}
                                thousandSeparator
                                prefix={'  '}
                            />
                        </div>
                    </div>
                </div>
                <div className="notes">
                    <table className="table-header-info">
                        <tbody>
                            <tr>
                                <td className="label">Nama Merchant</td>
                                <td className="detail-info">{merchant.name}</td>
                            </tr>
                            <tr>
                                <td className="label">Order ID</td>
                                <td className="detail-info">{merchant.orderID}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {isAlert == true && (
                    <Alert className="alert-cc">
                        <div style={{ display: 'flex', justifyContent: 'center', verticalAlign: "middle" }}>
                            {alertIcon == true && (
                                <div style={{ marginRight: 15 }}>
                                    <FontAwesomeIcon icon={faExclamationTriangle} size={"lg"} />
                                </div>
                            )}
                            <div style={{ fontSize: 10 }}>
                                {alertMessage}
                            </div>
                        </div>
                    </Alert>
                )}
            </div>

        )
    }
}
