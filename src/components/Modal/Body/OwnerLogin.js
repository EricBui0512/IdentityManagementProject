import React, { Component } from 'react';
import RaisedButton from "material-ui/RaisedButton";
import {connect} from 'react-redux';
import {
    MODAL_CREATE_ACCOUNT,
    MODAL_EXISTING,
} from "../constants";
class OwnerLogin extends Component {
    render() {
        return (
            <div className="mh250 pd10">
                <div className="intro-popup-top">
                    <h4 className="text-center">Ehereum network: <b>{this.props.global.nodeName}</b></h4>
                    <h4 className="text-center">You need an ethereum accounts to use the application</h4>
                </div>

                <div className="flexible-evenly">
                    <RaisedButton
                        label="NEW ACCOUNT"
                        labelColor="#fff"
                        backgroundColor="#5c57a3"
                        onClick={() => this.props.setType(MODAL_CREATE_ACCOUNT)}
                    />
                    <RaisedButton
                        label="EXISTING ACCOUNT"
                        labelColor="#fff"
                        backgroundColor="#5c57a3"
                        onClick={() => this.props.setType(MODAL_EXISTING)}
                    />
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    global: state.global,
});

export default connect(mapStateToProps)(OwnerLogin);
