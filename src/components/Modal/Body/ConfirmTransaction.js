import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import { connect } from 'react-redux'
import { unlock } from "../../../utils/keys"
import { verifyEmail, verifyNumber } from "../../../utils/validators"
import Web3 from "web3";
import constants from '../../../services/constants';
import EthereumService from '../../../services/ethereum';
import ServerService from '../../../services/server';
import {
    deployFacet,
    addFacetToProfile,
    deployFacetField,
    shareToAccount,
    destroyFacet,
    updateFacetAttributes,
    inviteToVerify,
    revokeShare,
    verifyFacet
} from '../../../services/facet';
import { addTx } from '../../../actions/txActions';
import Tx from '../../../services/tx';
import { deployPrimaryDataOnUserProfile } from "../../../actions/userProfileActions"
import { deleteFacet, syncFacetFields } from "../../../actions/facetActions"
import _ from "lodash";
class ConfirmTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountAddress: "",
            passpharse: "",
            gasLimit: 4712388,
            gasPrice: 50000000000,
            disabled: false,
            submitted: false,
            labelButton: "Confirm",
            errors: {
                accountAddress: "",
                passpharse: "",
                gasLimit: "",
                gasPrice: ""
            }
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    isValidData = () => {
        var errors = this.state.errors;
        return (errors.accountAddress === "" && errors.passpharse === "" && errors.userName === "" && errors.email === "" && errors.gasPrice === "" && errors.gasLimit === "")
    }
    validate = () => {
        let state = this.state;

        if (verifyNumber(this.state.gasLimit) != null) {
            state = { ...state, errors: { ...state.errors, gasLimit: "invalid Gas Limit" } };
        } else {
            state = { ...state, errors: { ...state.errors, gasLimit: "" } };
        }

        if (verifyNumber(this.state.gasPrice) != null) {
            state = { ...state, errors: { ...state.errors, gasPrice: "invalid Gas Price" } };
        } else {
            state = { ...state, errors: { ...state.errors, gasPrice: "" } };
        }

        if (this.state.accountAddress === "") {
            state = { ...state, errors: { ...state.errors, accountAddress: "Account name is empty" } };
        } else {
            state = { ...state, errors: { ...state.errors, accountAddress: "" } };
        }

        if (this.state.passpharse === "" && this.props.metamask === false) {
            state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
        } else {
            state = { ...state, errors: { ...state.errors, passpharse: "" } };
        }
        this.setState(state);
    }
    _onDeploy = () => {
        if (this.state.submitted) {
            return;
        }
        this.validate();
        if (this.isValidData()) {
            let isMetamask = true;
            let address = this.getAccountAddress();
            let self = this
        }
        try{
            this.setState({
                submitted: true
            })
        }
        catch (ex) {
            console.log(ex);
        }

        let params = this.props.params
        let props = this.props
        var keyStore = ""
        let state = this.state
        let self = this
        if (this.props.accounts.accounts[params.userProfile.accountAddress]) {
            keyStore = this.props.accounts.accounts[params.userProfile.accountAddress].key
        } else {
            if (params.address2) {
                keyStore = this.props.accounts.accounts[params.address2].key
            }
        }

        if (params.txType === constants.TX_TYPE_FACET) {
            if (params.facet.title == "Primary") {
                props.dispatch(deployPrimaryDataOnUserProfile())
            }
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                try{
                    deployFacet(
                        params.facet.title, params.userProfile.accountAddress,params.userProfile.userProfileAddress,
                        params.userProfile.isMetamask, state.gasLimit,
                        state.gasPrice, state.passpharse,
                        keyStore, props.ethereum,nonce).then((hash) => {
                            const tx = new Tx(
                                hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                                nonce, "pending", "deploy facet", {
                                    userProfileAddress: params.userProfile.userProfileAddress,
                                    facetAddress: params.facet.facetAddress,
                                    owner: params.userProfile.accountAddress,
                                    isMetamask: params.userProfile.isMetamask,
                                    gas: state.gasLimit,
                                    gasPrice: state.gasPrice,
                                    keyString: keyStore,
                                    password: state.passpharse,
                                    nonce: nonce+1,
                                    title: params.facet.title,
                                    facetKey: params.facet.facetKey
                                }, "", params.userProfile.isMetamask)

                            props.dispatch(addTx(tx))

                            this.setState({
                                submitted: false
                            })
                            props.closeModal()
                        })
                }
                catch(exception){
                    console.log(exception)
                    state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                    self.setState(state)
                }
            })

        }
        if (params.txType === constants.TX_TYPE_FACET_FIELD){
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                try{
                    deployFacetField(
                        params.facetField.name,
                        params.facetField.value,
                        params.facetField.facetAddress,
                        params.userProfile.accountAddress,
                        params.userProfile.isMetamask,
                        state.gasLimit,
                        state.gasPrice, state.passpharse,
                        keyStore, props.ethereum,nonce
                    ).then((hash) => {
                        const tx = new Tx(
                            hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                            nonce, "pending", "add field to facet", {
                                userProfileAddress: params.userProfile.userProfileAddress,
                                owner: params.userProfile.accountAddress,
                                isMetamask: params.userProfile.isMetamask,
                                gas: state.gasLimit,
                                gasPrice: state.gasPrice,
                                keyString: keyStore,
                                password: state.passpharse,
                                nonce: nonce+1,
                                facetField: params.facetField,
                            }, "", params.userProfile.isMetamask)

                        props.dispatch(addTx(tx))

                        self.setState({
                            submitted: false
                        })
                        props.closeModal()
                    })
                }
                catch(exception){
                    state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                    self.setState(state)
                }
            })
        }
        if (params.txType === constants.TX_TYPE_SHARE_DATA){
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                props.api.createShareKey(params.facetKey, params.toEmail).then((res) => {
                    try{
                        shareToAccount(
                            params.address,
                            params.facetAddress,
                            params.userProfile.accountAddress,
                            params.userProfile.isMetamask,
                            state.gasLimit,
                            state.gasPrice, state.passpharse,
                            keyStore, props.ethereum,nonce,
                            res.shareKey
                        ).then((hash) => {
                            const tx = new Tx(
                                hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                                nonce, "pending", "share to account", {
                                    facetAddress: params.facetAddress,
                                    account: params.userProfile.accountAddress,
                                    isMetamask: params.userProfile.isMetamask,
                                    gas: state.gasLimit,
                                    gasPrice: state.gasPrice,
                                    keyString: keyStore,
                                    nonce: nonce+1,
                                    facetField: params.facetField,
                                    address: params.address,
                                    publicKey: params.userProfile.publicKey,
                                    facetKey: params.facetKey,
                                    fromEmail: params.userProfile.email,
                                    toEmail: params.toEmail,
                                    clientURL: constants.REMOTE_API_HOST,
                                }, "", params.userProfile.isMetamask)

                            props.dispatch(addTx(tx))
                            self.setState({
                                submitted: false
                            })
                            props.closeModal()
                            if (_.isFunction(params.callback)) {
                                params.callback()
                            }
                        })
                    }
                    catch(exception){
                        console.log(exception);
                        state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                        self.setState(state)
                    }
                });
            })
        }
        if (params.txType === constants.TX_TYPE_RE_SHARE_DATA){
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                props.api.createShareKey(params.facetKey, params.toEmail).then((res) => {
                    try{
                        shareToAccount(
                            params.address,
                            params.facetAddress,
                            params.userProfile.accountAddress,
                            params.userProfile.isMetamask,
                            state.gasLimit,
                            state.gasPrice, state.passpharse,
                            keyStore, props.ethereum,nonce,
                            res.shareKey
                        ).then((hash) => {
                            const tx = new Tx(
                                hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                                nonce, "pending", "re-share to account", {
                                    facetAddress: params.facetAddress,
                                    account: params.userProfile.accountAddress,
                                    isMetamask: params.userProfile.isMetamask,
                                    gas: state.gasLimit,
                                    gasPrice: state.gasPrice,
                                    keyString: keyStore,
                                    nonce: nonce+1,
                                    facetField: params.facetField,
                                    address: params.address,
                                    publicKey: params.userProfile.publicKey,
                                    facetKey: params.facetKey,
                                    fromEmail: params.userProfile.email,
                                    toEmail: params.toEmail,
                                    clientURL: constants.REMOTE_API_HOST,
                                    extraData: params.extraData,
                                    facetIndex: params.facetIndex
                                }, "", params.userProfile.isMetamask)

                            props.dispatch(addTx(tx))
                            self.setState({
                                submitted: false
                            })
                            props.closeModal()
                        })
                    }
                    catch(exception){
                        console.log(exception);
                        state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                        self.setState(state)
                    }
                });
            })
        }

        if (params.txType === constants.TX_TYPE_DELETE_FACET){
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                try{
                    destroyFacet(
                        params.userProfile.accountAddress,
                        params.facetAddress,
                        params.userProfile.userProfileAddress,
                        params.userProfile.isMetamask,
                        state.gasLimit,
                        state.gasPrice, state.passpharse,
                        keyStore, props.ethereum,nonce
                    ).then((hash) => {
                        props.dispatch(deleteFacet(params.facetAddress))
                        const tx = new Tx(
                            hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                            nonce, "pending", "delete facet", {
                                facetAddress: params.facetAddress,
                                account: params.userProfile.accountAddress,
                                isMetamask: params.userProfile.isMetamask,
                                gas: state.gasLimit,
                                gasPrice: state.gasPrice,
                                keyString: keyStore,
                                nonce: nonce+1,
                                facetField: params.facetField,
                                address: params.address,
                                publicKey: params.userProfile.publicKey,
                                facetKey: params.facetKey,
                                fromEmail: params.userProfile.email,
                                toEmail: params.toEmail,
                            }, "", params.userProfile.isMetamask)

                        props.dispatch(addTx(tx))
                        params.callback();
                        props.closeModal()
                    })
                }
                catch(exception){
                    state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                    self.setState(state)
                }
            })
        }

        if (params.txType === constants.TX_TYPE_SYNC_FACET_FIELD){
            console.log(params);
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                var fieldKeys = [];
                var fieldValues = [];
                var deletedKeys = params.facet.changes.deleted;
                _.forEach(params.facet.changes.updated, function(value) {
                  fieldKeys.push(value.name);
                  fieldValues.push(value.value);
                });
                try{
                    updateFacetAttributes(
                        params.userProfile.accountAddress,
                        params.facetAddress,
                        fieldKeys,
                        fieldValues,
                        deletedKeys,
                        params.userProfile.isMetamask,
                        state.gasLimit,
                        state.gasPrice, state.passpharse,
                        keyStore, props.ethereum,nonce
                    ).then((hash) => {
                        const tx = new Tx(
                            hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                            nonce, "pending", "sync facet field", {
                                facetAddress: params.facetAddress,
                                account: params.userProfile.accountAddress,
                                isMetamask: params.userProfile.isMetamask,
                                gas: state.gasLimit,
                                gasPrice: state.gasPrice,
                                keyString: keyStore,
                                nonce: nonce+1,
                                facetFields: params.facet.fields,
                                address: params.address,
                                publicKey: params.userProfile.publicKey,
                                facetKey: params.facetKey,
                                fromEmail: params.userProfile.email,
                                toEmail: params.toEmail,
                            }, "", params.userProfile.isMetamask)

                        props.dispatch(addTx(tx))
                        params.callback();
                        props.closeModal()
                    })
                }
                catch(exception){
                    state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                    self.setState(state)
                }
            })
        }
        if (params.txType === constants.TX_TYPE_INVITE){
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                props.api.createShareKey(params.facetKey, params.toEmail).then((res) => {
                    try{
                        inviteToVerify(
                            params.address,
                            params.facetAddress,
                            params.userProfile.accountAddress,
                            params.userProfile.isMetamask,
                            state.gasLimit,
                            state.gasPrice, state.passpharse,
                            keyStore, props.ethereum,nonce,
                            res.shareKey,
                            params.toEmail
                        ).then((hash) => {
                            const tx = new Tx(
                                hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                                nonce, "pending", "invite to verify", {
                                facetAddress: params.facetAddress,
                                account: params.userProfile.accountAddress,
                                isMetamask: params.userProfile.isMetamask,
                                gas: state.gasLimit,
                                gasPrice: state.gasPrice,
                                facetField: params.facetField,
                                address: params.address,
                                publicKey: params.userProfile.publicKey,
                                facetKey: params.facetKey,
                                fromEmail: params.userProfile.email,
                                toEmail: params.toEmail,
                                clientURL: constants.REMOTE_API_HOST,
                                nonce: nonce+1,
                                }, "", params.userProfile.isMetamask)
                            props.dispatch(addTx(tx))
                            props.closeModal()
                        })
                    }
                    catch(exception){
                        console.log(exception);
                        state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                        self.setState(state)
                    }
                });

            })

            self.setState({
                submitted: false
            })
            props.closeModal();
        }
        if (params.txType === constants.TX_TYPE_REVOKE){
            props.ethereum.getNonce(params.userProfile.accountAddress, (nonce) => {
                try{
                    revokeShare(
                        params.address,
                        params.facetAddress,
                        params.userProfile.accountAddress,
                        params.userProfile.isMetamask,
                        state.gasLimit,
                        state.gasPrice, state.passpharse,
                        keyStore, props.ethereum,nonce
                    ).then((hash) => {
                        const tx = new Tx(
                            hash, params.userProfile.accountAddress, state.gasLimit, state.gasPrice,
                            nonce, "pending", "revoke facet", {
                            facetAddress: params.facetAddress,
                            account: params.userProfile.accountAddress,
                            isMetamask: params.userProfile.isMetamask,
                            gas: state.gasLimit,
                            gasPrice: state.gasPrice,
                            facetField: params.facetField,
                            address: params.address,
                            publicKey: params.userProfile.publicKey,
                            facetKey: params.facetKey,
                            fromEmail: params.userProfile.email,
                            toEmail: params.toEmail,
                            clientURL: constants.REMOTE_API_HOST,
                            nonce: nonce+1,
                            facetIndex:params.facetIndex,
                            extraData: params.extraData
                            }, "", params.userProfile.isMetamask)
                        props.dispatch(addTx(tx))
                        props.closeModal()
                    })
                }
                catch(exception){
                    state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                    self.setState(state)
                }
            })
            props.closeModal();
        }
        if (params.txType === constants.TX_TYPE_VERIFY_FACET){
            props.ethereum.getNonce(params.userProfile.accountAddress || params.address2, (nonce) => {

                try{
                    verifyFacet(
                        params.address,
                        params.facetAddress,
                        params.userProfile.accountAddress || params.address2,
                        params.userProfile.isMetamask || params.isMetamask,
                        state.gasLimit,
                        state.gasPrice, state.passpharse,
                        keyStore, props.ethereum,nonce,
                        params.fromEmail,
                        params.statusVerify,
                        params.inNetwork
                    ).then((hash) => {
                        const tx = new Tx(
                            hash, params.userProfile.accountAddress || params.address2, state.gasLimit, state.gasPrice,
                            nonce, "pending", "verify facet", {
                            facetAddress: params.facetAddress,
                            account: params.userProfile.accountAddress || params.address2,
                            isMetamask: params.userProfile.isMetamask || params.isMetamask,
                            gas: state.gasLimit,
                            gasPrice: state.gasPrice,
                            facetField: params.facetField,
                            address: params.address,
                            publicKey: params.userProfile.publicKey || null,
                            facetKey: params.facetKey,
                            fromEmail: params.fromEmail,
                            toEmail: params.toEmail,
                            clientURL: constants.REMOTE_API_HOST,
                            nonce: nonce+1,
                        }, "", params.userProfile.isMetamask || params.isMetamask)
                        props.dispatch(addTx(tx))
                        params.callback();
                        props.closeModal()
                    })
                }
                catch(exception){
                    console.log(exception)
                    state = { ...state, errors: { ...state.errors, passpharse: "Passpharse is invalid" } };
                    self.setState(state)
                }
            })
            props.closeModal();
        }
    }
    getContractAddress = (userProfileAddress) => {
        this.setState({
            userProfileAddress: userProfileAddress
        });
    }
    addUserProfile = () => {
        this.props.closeModal();
    }
    rejectTransaction = () => {
        this.setState({ submitted: false, labelButton: "CREATE NEXTID ACCOUNT" });
    }
    submitTransaction = () => {
        this.setState({ submitted: true, labelButton: "PENDING..." });
    }
    getAccountAddress = () => {
        return this.props.params.userProfile.accountAddress || this.props.params.address2
    }

    render() {
        return (
            <div className="mh250 pd10 relative">
                {
                    this.state.submitted ?
                        (
                            <div className="absolute-fancy-loading flexible">
                                <div className="loader-medium" />
                            </div>
                        )
                        : undefined
                }
                <div className="form-modal">
                    <TextField
                        floatingLabelText="Account address"
                        fullWidth={true}
                        disabled={this.state.disabled}
                        value={this.getAccountAddress()}
                    /><br />
                    <TextField
                        floatingLabelText="Gas limit"
                        fullWidth={true}
                        disabled={this.state.disabled}
                        value={this.state.gasLimit}
                        errorText={this.state.errors.gasLimit}
                        onChange={(e) => this.setState({ gasLimit: e.target.value })}
                    /><br />
                    <TextField
                        floatingLabelText="Gas price"
                        fullWidth={true}
                        disabled={this.state.disabled}
                        value={this.state.gasPrice}
                        errorText={this.state.errors.gasPrice}
                        onChange={(e) => this.setState({ gasPrice: e.target.value })}
                    /><br />
                    {
                        this.props.params.userProfile.isMetamask ?
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
                                    onChange={(e) => this.setState({ passpharse: e.target.value })}
                                />
                            )
                    }

                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label={this.state.labelButton}
                            labelColor="#fff"
                            disabled={this.state.disabled}
                            backgroundColor="#5c57a3"
                            onClick={this._onDeploy}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    accounts: state.accounts,
    ethereum: new EthereumService(this.state),
    api: new ServerService()
});

export default connect(mapStateToProps)(ConfirmTransaction);
