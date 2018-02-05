import React, { Component } from 'react';
import RaisedButton from "material-ui/RaisedButton";
import {
    MODAL_METAMASK,
    MODAL_IMPORT_ACCOUNT
} from "../constants";
class Existing extends Component {
    render() {
        return (
            <div className="mh250 pd10">
                <div className="intro-popup-top">
                    <h4 className="text-center">Ehereum network: <b>Rinkeby</b></h4>
                    <h4 className="text-center">You have to login by an ethereum account</h4>
                </div>

                <div className="flexible-evenly">
                    <RaisedButton
                        label="IMPORT ACCOUNT"
                        labelColor="#fff"
                        backgroundColor="#5c57a3"
                        onClick={() => this.props.setType(MODAL_IMPORT_ACCOUNT)}
                    />
                    <RaisedButton
                        label="UNLOCK METAMASK"
                        labelColor="#fff"
                        backgroundColor="#5c57a3"
                        onClick={() => this.props.setType(MODAL_METAMASK)}
                    />
                </div>
            </div>
        );
    }
}
export default Existing;
