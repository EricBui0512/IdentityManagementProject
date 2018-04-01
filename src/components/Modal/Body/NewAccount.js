import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import {
    MODAL_INSUFFICIENT_FUNDS
} from "../constants";
import EthereumService from "../../../services/ethereum";
import {connect} from 'react-redux';
import {addEthereumKey, useMetamask} from "../../../actions/appAction";
import { addressFromKey } from "../../../utils/keys"
import { specifyName, specifyDesc, emptyForm,  throwError } from "../../../actions/createKeyStoreActions";
import { verifyAccount, verifyKey, verifyPassphrase, anyErrors } from "../../../utils/validators";
import { createAccount } from "../../../actions/accountActions"
class NewAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountName: "",
            passpharse: "",
            rePasspharse: "",
            address: "",
            key: "",
            error: false,
            errorName: false,
            errorPass: false,
            loading: false,
            step:1
        }
    }
    validation = () => {
        if (this.state.accountName == "") {
            this.setState({errorName: "Please fill out the field"});
            return false;
        }
        if (this.state.passpharse == "") {
            this.setState({errorPass: "Please fill out the field"});
            return false;
        }
        return true;
    }
    createAccount = (event) => {
        event.preventDefault();
        let errors = {};
        let ethereum = this.props.ethereum;
        let password = this.state.passpharse;
        let repassword = this.state.rePasspharse;
        errors["passwordError"] = verifyPassphrase(password, repassword);
        if (!this.validation()) {
            return;
        }
        if (anyErrors(errors)) {
            this.setState({ error: "The rePasspharse does not match" });
        } else {
            this.setState({
                loading:true
            });
            let keyString = JSON.stringify(ethereum.createNewAddress(password));
            let address = addressFromKey(keyString);
            this.props.dispatch(createAccount(address, keyString, this.state.accountName, ""));
            this.props.dispatch(emptyForm());
            this.props.dispatch(useMetamask(false));
            addEthereumKey(this.props.dispatch, {address: address, key: keyString, account_name: this.state.accountName});
            this.setState(
                {
                    address: address,
                    key: keyString,
                    step:2,
                    loading:false,
                }
            );

        }
    }
    nextStep = () => {
        this.props.setType(MODAL_INSUFFICIENT_FUNDS);
    }

    downloadKeyStore = () => {
        console.log(this.props.AppReducer, this.props.accounts);
        var keystore = this.state.key;
        var address = this.state.address;
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;c;harset=utf-8,' + encodeURIComponent(keystore));
        element.setAttribute('download', address);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    _renderBody = () => {
        if (this.state.step == 1) {
            return (
                <div>
                    <TextField
                        floatingLabelText="Account name"
                        fullWidth={true}
                        value={this.state.accountName}
                        errorText={this.state.errorName}
                        onChange={(e) => this.setState({accountName: e.target.value, errorName: false})}
                    /><br />
                    <TextField
                        floatingLabelText="Passpharse"
                        fullWidth={true}
                        type="password"
                        value={this.state.passpharse}
                        errorText={this.state.errorPass}
                        onChange={(e) => this.setState({passpharse: e.target.value, errorPass: false})}
                    /><br />
                    <TextField
                        floatingLabelText="Retype Passpharse"
                        fullWidth={true}
                        type="password"
                        value={this.state.rePasspharse}
                        errorText={this.state.error}
                        onChange={(e) => this.setState({rePasspharse: e.target.value, error: false})}
                    />
                </div>
            );
        }
        return (
            <div className="downloadKeyStore flexible mgb-30">
                <div className="text-center">
                    <h3 className="mgb-30">Download Key Your Store</h3>
                    <button className="btn" onClick={this.downloadKeyStore}>
                        <i className="fa fa-download"></i>
                    </button>
                </div>
            </div>

        )
    }

    render() {
        return (
            <div className="mh250 pd10">
                <div className="form-modal">
                    {this._renderBody()}
                    <div className="flexible-end mg30-0">
                        {
                            !this.state.loading ?
                            (
                                <RaisedButton
                                    label={this.state.step == 1 ? "CREATE AN ACCOUNT" : "NEXT"}
                                    labelColor="#fff"
                                    backgroundColor="#5c57a3"
                                    onClick={(e) => this.state.step == 1 ? this.createAccount(e) : this.nextStep(e)}
                                />
                            )
                            :
                            (
                                <div className="maskButton pd-5-50">
                                    <div className="loader-mini" />
                                </div>
                            )
                        }
                    </div>
                </div>

            </div>
        );
    }
}
const mapStateToProps = state => ({
    AppReducer: state.AppReducer,
    accounts: state.accounts,
    ethereum: new EthereumService(state),
});

export default connect(mapStateToProps)(NewAccount);
