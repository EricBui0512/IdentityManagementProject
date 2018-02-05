import React, { Component } from 'react';
class ContactList extends Component {
    render() {
        return (
            <div className="panel">
                <div className="panel-heading bg-c7c6c6">
                    <h3 className="mg-0 uppercase"> Contact </h3>
                </div>
                <div className="panel-body pd-0">
                    <a className="none-effect block">
                        <div className="pd-15 contact-items">
                            <h4 className="uppercase color-000 mg-0 bold">Olinda Cho</h4>
                            <p className="mgt-5 italic color-77808c">olinda.cho@gmail.com</p>
                        </div>
                    </a>
                    <a className="none-effect block">
                        <div className="pd-15 contact-items">
                            <h4 className="uppercase color-000 mg-0 bold">Olinda Cho</h4>
                            <p className="mgt-5 italic color-77808c">olinda.cho@gmail.com</p>
                        </div>
                    </a>
                    <a className="none-effect block">
                        <div className="pd-15 contact-items">
                            <h4 className="uppercase color-000 mg-0 bold">Olinda Cho</h4>
                            <p className="mgt-5 italic color-77808c">olinda.cho@gmail.com</p>
                        </div>
                    </a>
                </div>
            </div>
        );
    }
}

export default ContactList;
