import React, { Component } from 'react';
import cancel_circle from './../assets/cancel-circle.png';

export default class NotFoundPage extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="not-found-page">
                    <div>
                        <img style={{ width: 135, height: 135 }} src={cancel_circle} alt="not-found" />
                    </div>
                    <div className="not-found-text">
                        Data tidak Valid
                    </div>
                </div>
            </React.Fragment>
        )
    }
}