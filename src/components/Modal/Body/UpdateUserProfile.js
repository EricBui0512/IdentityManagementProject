import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import EthereumService from "../../../services/ethereum";
import {connect} from 'react-redux';
import  {verifyEmail, verifyNumber } from "../../../utils/validators"
import { updateUserProfile } from "../../../actions/userProfileActions";
import Web3 from "web3";
import _ from "lodash"
class UpdateUserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.userProfile.data;
        this.state.errors = {
            accountAddress: "",
            passpharse: "",
            userName: "",
            email: "",
            gasLimit: "",
            gasPrice: ""
        }
        this.state.userName = this.state.userName || "";
        this.state.email = this.state.email || "";
        this.state.accountAddress = this.state.accountAddress || Object.keys(this.props.accounts.accounts)[0];
        this.state.gasLimit = 4712388;
        this.state.gasPrice = 1000000000;
    }

    isValidData = () => {
        var errors = this.state.errors;
        return (errors.passpharse === "" && errors.userName === "" && errors.email === "" && errors.gasPrice === "" && errors.gasLimit === "")
    }
    validate = () => {
        let state = this.state;
        if (!verifyEmail(this.state.email)) {
            state = { ...state, errors:  { ...state.errors, email : "invalid email"}};
        } else {
            state = { ...state, errors:  { ...state.errors, email : ""}};
        }

        if (verifyNumber(this.state.gasLimit) != null) {
            state = { ...state, errors:  { ...state.errors, gasLimit : "invalid Gas Limit"}};
        } else {
            state = { ...state, errors:  { ...state.errors, gasLimit : ""}};
        }

        if (verifyNumber(this.state.gasPrice) != null) {
            state = { ...state, errors:  { ...state.errors, gasPrice : "invalid Gas Price"}};
        } else {
            state = { ...state, errors:  { ...state.errors, gasPrice : ""}};
        }

        if (this.state.accountAddress === "") {
            state = { ...state, errors:  { ...state.errors, accountAddress : "Account name is empty"}};
        } else {
            state = { ...state, errors:  { ...state.errors, accountAddress : ""}};
        }

        if (this.state.userName === "") {
            state = { ...state, errors:  { ...state.errors, userName : "Username is empty"}};
        } else {
            state = { ...state, errors:  { ...state.errors, userName : ""}};
        }
        this.setState(state);
    }
    updateProfile = () => {
        this.validate()
        if (this.isValidData()){
            let address = this.props.userProfile.data.accountAddress;
            let keyStore = ""
            if (!_.isEmpty(this.props.accounts.accounts)){
                keyStore = this.props.accounts.accounts[address].key
            }
            try {
                this.props.ethereum.updateUserProfile(address,this.state.userName,this.state.email,this.state.gasLimit,this.state.gasPrice,this.props.userProfile.data.isMetamask,keyStore,this.state.passpharse);
            } catch (e) {
                console.log(e)
                var state = this.state;
                state = { ...state, errors:  { ...state.errors, passpharse : "Passpharse is invalid"}};
                this.setState(state)
                return
            }
            this.props.dispatch(updateUserProfile(this.state));
            this.props.closeModal();
        }
    }

    render() {
        return (
            <div className="mh250 pd10">
                <div className="form-modal">
                    <TextField
                        floatingLabelText="Account address"
                        fullWidth={true}
                        value={this.state.accountAddress}
                        errorText={this.state.errors.accountAddress}
                    /><br />
                    <TextField
                        floatingLabelText="User Name"
                        fullWidth={true}
                        value={this.state.userName}
                        errorText={this.state.errors.userName}
                        onChange={(e) => this.setState({userName: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Email"
                        fullWidth={true}
                        type="email"
                        value={this.state.email}
                        errorText={this.state.errors.email}
                        onChange={(e) => this.setState({email: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Gas limit"
                        fullWidth={true}
                        value={this.state.gasLimit}
                        errorText={this.state.errors.gasLimit}
                        onChange={(e) => this.setState({gasLimit: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Gas price"
                        fullWidth={true}
                        value={this.state.gasPrice}
                        errorText={this.state.errors.gasPrice}
                        onChange={(e) => this.setState({gasPrice: e.target.value})}
                    /><br />
                    {
                        this.props.userProfile.data.isMetamask ?
                        (
                            undefined
                        )
                        :
                        (
                            <TextField
                                floatingLabelText="Passpharse"
                                fullWidth={true}
                                type="password"
                                disabled={this.state.disabled}
                                value={this.state.passpharse}
                                errorText={this.state.errors.passpharse}
                                onChange={(e) => this.setState({passpharse: e.target.value})}
                            />
                        )
                    }
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="UPDATE"
                            labelColor="#fff"
                            backgroundColor="#5c57a3"
                            onClick={this.updateProfile}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    AppReducer: state.AppReducer,
    accounts: state.accounts,
    global: state.global,
    userProfile: state.userProfile,
    ethereum: new EthereumService(state),
});

export default connect(mapStateToProps)(UpdateUserProfile);
