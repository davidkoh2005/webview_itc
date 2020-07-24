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

    
    getData() {
        const _this = this
        var bodyFormData = new FormData();
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        let profile = _this.element.state.profile
        bodyFormData.set('order_number', profile.orderNumber);
        axios.post("http://128.199.185.168/api/webview/initial", bodyFormData, this.headerToken())
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
                    merchant.orderID = data.transaction_no
                    merchant.referenceNumber = data.transaction_no
                    merchant.transID = data.id

                    totalPrice.price = data.amount
                    totalPrice.currency = "Rp. "

                    let tempOrderDetail = data.description
                    tempOrderDetail.map(x => {
                        let bodyDetail = {
                            items: x.description,
                            amount: x.amount,
                            currency: "Rp. "
                        }
                        orderDetail.push(bodyDetail)
                    })
                    // orderDetail.items = data.description
                    // orderDetail.amount = data.amount
                    // orderDetail.currency = data.currency
                    if (data.customer) {
                        
                        let user = data.customer
                        customerDetail.name = user.name
                        customerDetail.phone = user.phone
                        customerDetail.email = user.email

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

    postBukti() {
        const _this = this
        var bodyFormData = new FormData();
        let isLoading = _this.element.state.isLoading
        isLoading = true
        _this.element.setState({ isLoading })
        let profile = _this.element.state.profile
        bodyFormData.set('order_number', profile.orderNumber);
        bodyFormData.set('receipt_photo',_this.element.state.file);
        axios.post("http://128.199.185.168/api/webview/receipt-photo/submit", bodyFormData, this.headerToken())
            .then(res => {
                if (res && res.data.status_code == 200) {
                    window.location.href = "/backtoapps"
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
                else{
                    swal({
                        text: "Failed Upload Image",
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
    
}