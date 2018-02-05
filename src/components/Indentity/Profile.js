import React, { Component } from 'react';
class Profile extends Component {
    render() {
        return (
            <div>
                <div className="row mgb-10">
                    <p className="col-sm-3 uppercase color-77808c">name</p>
                    <p className="col-sm-9">Olinda Cho</p>
                </div>
                <div className="row mgb-10">
                    <p className="col-sm-3 uppercase color-77808c">email</p>
                    <p className="col-sm-9">olinda.cho@gmail.com</p>
                </div>
                <div className="row mgb-10">
                    <p className="col-sm-3 uppercase color-77808c">user profile address</p>
                    <p className="col-sm-9">Next Id</p>
                </div>
                <div className="row mgb-10">
                    <p className="col-sm-3 uppercase color-77808c">linkedin</p>
                    <p className="col-sm-9">https://linkedin</p>
                </div>
            </div>
        );
    }
}

export default Profile;
