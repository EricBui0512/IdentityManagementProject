import React, { Component } from 'react';
import {
    MODAL_SHARE_DATA,
} from "../Modal/constants";
class Authorization extends Component {

    openModal = () => {
        this.props.setType(MODAL_SHARE_DATA);
    }

    render() {
        return (
            <div>
                <table className="table table-responsive">
                    <thead>
                        <tr>
                            <th>Times</th>
                            <th>Email</th>
                            <th>Account Adress</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>john@example.com</td>
                            <td>0x000egjfkgj2312j3</td>
                            <td>
                                <a className="btn btn-info mgr-10" onClick={this.openModal}>Re-share</a>
                                <a className="btn btn-danger">Revoke</a>
                            </td>
                        </tr>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>john@example.com</td>
                            <td>0x000egjfkgj2312j3</td>
                            <td>
                                <a className="btn btn-info mgr-10" onClick={this.openModal}>Re-share</a>
                                <a className="btn btn-danger">Revoke</a>
                            </td>
                        </tr>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>john@example.com</td>
                            <td>0x000egjfkgj2312j3</td>
                            <td>
                                <a className="btn btn-info mgr-10" onClick={this.openModal}>Re-share</a>
                                <a className="btn btn-danger">Revoke</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <a className="btn-action btn" onClick={this.openModal}>SHARE</a>
            </div>

        );
    }
}

export default Authorization;
