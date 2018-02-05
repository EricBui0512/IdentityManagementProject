import React, { Component } from 'react';
import {
    MODAL_VERIFY,
} from "../Modal/constants";
class Verification extends Component {

    openVerifyScreen = () => {
        this.props.setType(MODAL_VERIFY);
    }

    render() {
        return (
            <div>
                <table className="table table-responsive">
                    <thead>
                        <tr>
                            <th>Times</th>
                            <th>Email</th>
                            <th>Account</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>john@example.com</td>
                            <td>john.eth</td>
                            <td>
                                <a className="btn btn-primary">Pending</a>
                            </td>
                        </tr>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>john@example.com</td>
                            <td>john.eth</td>
                            <td>
                                <a className="btn btn-success">Verified</a>
                            </td>
                        </tr>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>john@example.com</td>
                            <td>john.eth</td>
                            <td>
                                <a className="btn btn-danger">Reject</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <a className="btn-action btn" onClick={this.openVerifyScreen}>VERIFY</a>
            </div>
        );
    }
}

export default Verification;
