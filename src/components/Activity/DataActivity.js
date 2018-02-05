import React, { Component } from 'react';
class DataActivity extends Component {
    render() {
        return (
            <div className="block activityContainer">
                <table className="table table-responsive table-hover">
                    <thead>
                        <tr>
                            <th>Times</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>Verification</td>
                            <td>0x000egjfkgj2312j3</td>
                        </tr>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>Authorization</td>
                            <td>0x000egjfkgj2312j3</td>
                        </tr>
                        <tr>
                            <td>12:00 PM 16-2-2018</td>
                            <td>Authorization</td>
                            <td>0x000egjfkgj2312j3</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default DataActivity;
