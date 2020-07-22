import React, { Component } from 'react';

import swal from 'sweetalert';
import BlockUi from 'react-block-ui';
import { Breadcrumb } from 'antd';

import IndexCtrl from './../controllers/index';
import './index.less';
import './block-ui.css';

export default class IndexComponents extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="container-body">
                <div className="header-content">
                    
                </div>
                <div className="body-content">
                    
                </div>
                <div className="footer-content">

                </div>
            </div>
        )
    }
}