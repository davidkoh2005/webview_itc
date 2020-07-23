import React, { Component } from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

import AppsComponents from './App'
// import PaymentForm from './paymentFine/PaymentForm'
// import NotFoundPage from './NotFoundPage'

export default class IndexComponents extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <AppsComponents />
        )
    }
}