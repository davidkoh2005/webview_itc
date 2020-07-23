import React, { Component } from 'react';
import korlantas_logo from './../assets/korlantas-logo.png';

export default class RedirectPath extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="not-found-page">
                    <div>
                        <img style={{ height: 135 }} src={korlantas_logo} alt="not-found" />
                    </div>
                    <div className="not-found-text back-apps">
                        KORLANTAS
                    </div>
                </div>
            </React.Fragment>
        )
    }
}