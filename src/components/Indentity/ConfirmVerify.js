import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from "lodash"
import ServerService from '../../services/server';
import EthereumService from "../../services/ethereum";
import CryptoJS from 'crypto-js'
import {
    MODAL_CONFIRM_TRANSACTION,
    MODAL_OWNER_LOGIN,
    MODAL_METAMASK,
    MODAL_CREATE_ACCOUNT
} from "../Modal/constants"
import constants from '../../services/constants';
import Modal from "../Modal"
import moment from 'moment'
const VERIFY = 2;
const DECLINE = 3;
const FacetField = ({field, value, prefix, downloadFacetFile}) => {
    return (
        <div className="row mgb-10">
            <p className="col-sm-3 uppercase color-77808c">{field.name}</p>
            <p className="col-sm-9">
            {
                prefix == "Tx" ?
                (
                        (_.includes(value,"http://") || _.includes(value,"https://")) ?(
                            <a href={value} target="_blank">{value}</a>
                        ): (
                            <span>{value}</span>
                        )
                ):
                (
                    <a className="" onClick={(e) => downloadFacetFile(e, value)} href={value}>
                        <i className="fa fa-download mgr-5"></i>Download
                    </a>
                )
            }
            </p>
        </div>
    );
}
class ConfirmVerify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : {},
            facetKey: null,
            showButton: false,
            email: false,
            submited: false,
            textDone: false,
            title:false,
            secondModal: {
                isOpen: false,
                type: MODAL_CONFIRM_TRANSACTION,
                address: null,
                fromEmail: null,
                toEmail: null,
            },
            statusVerify: VERIFY,
            inNetwork : false,
            id: false,
            type:MODAL_OWNER_LOGIN,
            isOpen: false,
            metamask: false
        }
        this.state.facetAddress = this.props.match.params.pathParam1;
        this.state.shareKey = this.props.match.params.pathParam2;
        this.callBackModal = "verify";
        this.action = "verify";
    }
    componentDidMount() {
        this.props.api.loadFacetByAddress(this.state.facetAddress).then((data) => {
            this.setState({
                data: data.revisedFields,
                facetKey: data.facetKey,
                accountAddress: data.owner,
                toEmail: data.ownerEmail,
                userName: data.userName,
                title: data.title
            });
        });
        this.props.api.getStatusActivity(this.state.facetAddress, this.state.shareKey).then((data) => {
            this.setState({
                showButton: data.type === 1 ? true : false,
                fromEmail: data.email,
                id: data.id,
                statusVerification: data.status,
                textVerified: data.status === 2 ? "Verified" : "Declined",
                submited: data.status !== 1 ? true : false,
                dateTime: data.dateTime
            });
        })
    }
    closeModal = () => {
        this.setState({
            isOpen: false
        });
    }
    setType = (type) => {
        if (type === MODAL_METAMASK) {
            this.setState({
                metamask: true
            });
        } else if (type === MODAL_CREATE_ACCOUNT) {
            this.setState({
                metamask: false
            });
        }
        this.setState({
            type: type,
            isOpen: true,
        });
        return true;
    }
    openSecondModal = (txType, statusVerify = VERIFY) => {
        this.setState({
            secondModal: {
                isOpen: true,
                type:MODAL_CONFIRM_TRANSACTION
            },
            txType: txType,
            callback: this.callBackVerify,
            statusVerify: statusVerify,
                inNetwork: this.handleAccountInNextwork()
        });
    }
    closeSecondModal = () => {
        this.setState({
            secondModal: {
                isOpen: false,
            },
        })
    }
    _renderFacetDatas = () => {
        let elements = [];
        _.forEach(this.state.data, (field,index)=>{
            var value = field.value.substr(3,field.value.length -3);
            var prefix = field.value.substr(0,2);
            elements.push(
                <FacetField
                    key={index}
                    field={field}
                    value={this.decrypt(value)}
                    prefix={prefix}
                    downloadFacetFile={this.downloadFacetFile} />
            )
        });
        return elements;
    }
    downloadFacetFile = (e, url) => {
        e.preventDefault();
        this.props.api.downloadFacetFile(url, this.state.facetKey).then((data) => {
            var a = document.createElement('a');
            a.href = data.url;
            a.download = data.url;
            a.target = "_self";
            a.click();
            a.remove();
        });
    }
    decrypt = (input) => {
        try {
            let bytes  = CryptoJS.AES.decrypt(input, this.state.facetKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.log(error);
            return ""
        }

    }
    decline = () => {
        if (!_.isEmpty(this.props.userProfile.data) && this.props.userProfile.data.accountAddress !== "" ) {
            if(_.isFunction(this.openSecondModal)) {
                this.openSecondModal(constants.TX_TYPE_VERIFY_FACET, DECLINE);
            }
        } else {
            this.handleCheckBalanceAccount();
        }
        this.action = "decline";
        this.callBackModal = this.decline;
    }
    verify = () => {
        if (!_.isEmpty(this.props.userProfile.data) && this.props.userProfile.data.accountAddress !== "" ) {
            if(_.isFunction(this.openSecondModal)) {
                this.openSecondModal(constants.TX_TYPE_VERIFY_FACET, VERIFY);
            }
        } else {
            this.handleCheckBalanceAccount();
        }
        this.action = "verify";
        this.callBackModal = this.verify;
    }
    handleCheckBalanceAccount = () => {
        let address = this.getAccountAddress();
        if (_.isUndefined(address)) {
            this.setType(MODAL_OWNER_LOGIN);
        } else {
            this.setState({
                address:address
            })
            this.props.ethereum.getBalance(address, this.getBalance);
        }
    }
    getBalance = (balance) => {
        if (balance > 0) {
            if (this.action === "verify") {
                this.openSecondModal(constants.TX_TYPE_VERIFY_FACET, VERIFY);
            } else {
                this.openSecondModal(constants.TX_TYPE_VERIFY_FACET, DECLINE);
            }

        } else {
            this.setType(MODAL_OWNER_LOGIN);
        }
    }
    getAccountAddress = () => {
        let address = undefined;
        address = Object.keys(this.props.accounts.accounts)[0];
        return address;
    }
    handleAccountInNextwork = () => {
        return !_.isEmpty(this.props.userProfile.data) && this.state.fromEmail === this.props.userProfile.data.email;
    }
    callBackVerify = () => {
        this.props.api.updateActivity(this.state.id, this.state.statusVerify).then((data) => {
            this.setState({
                submited: true,
                textDone: "Thank you for your verification!"
            });
        });
        return true;
    }

    render() {
        return (
            <div>
                <div className="flexible h70 white-bg">
                    <a className="italic text-center logo2 underline-none pointer" href="/">
                        <span className="color-a7a9a9">Next</span>
                        <span className="color-50468e bold">ID</span>
                    </a>
                </div>
                <div className="block pd30">
                    {
                        this.state.submited ?
                        (
                            <h3>Please confirm the following personal data is accurate</h3>
                        ) : null
                    }
                    <br />
                    <div className="panel relative mh-320">
                        <div className="panel-heading bg-c7c6c6">
                            <h3 className="mg-0"> {this.state.title}</h3>
                        </div>
                        <div className="panel-body pd-25">
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">facet address</p>
                                <p className="col-sm-9">{this.state.facetAddress}</p>
                            </div>
                            {this._renderFacetDatas()}
                            {
                                this.state.showButton ?
                                this.state.submited ?
                                (
                                    <h3>{this.state.textDone}</h3>
                                )
                                :
                                (
                                    <div className="row flexible-evenly pd30">
                                        <button className="btn btn-success btn-lg uppercase" onClick={this.verify}> verify </button>
                                        <button className="btn btn-danger btn-lg uppercase" onClick={this.decline}> decline </button>
                                    </div>
                                )
                                : null
                            }
                        </div>
                        {
                            this.state.statusVerification !== 1 ? (<h2 className="absolute-verification">{this.state.textVerified}</h2>) : null
                        }

                    </div>
                    <h3>This verification is requested by <b>{this.state.userName}</b> on {moment(parseInt(this.state.dateTime)).format('LLLL')}</h3>
                </div>
                <Modal
                    type={this.state.secondModal.type}
                    isOpen={this.state.secondModal.isOpen}
                    closeModal={this.closeSecondModal}
                    setType={this.openModal}
                    params={{
                        accounts:this.props.accounts,
                        userProfile: this.props.userProfile.data,
                        txType: this.state.txType,
                        callback:this.state.callback,
                        facetField: this.state.data,
                        facetFieldCallback: this.facetFieldCallback,
                        facetAddress:this.state.facetAddress,
                        address: this.state.accountAddress,
                        facetKey: this.state.facetKey,
                        toEmail: this.state.toEmail,
                        fromEmail: this.state.fromEmail,
                        statusVerify: this.state.statusVerify,
                        inNetwork: this.state.inNetwork,
                        address2: this.state.address,
                        isMetamask: this.state.metamask
                    }}
                />
                <Modal
                    type={this.state.type}
                    isOpen={this.state.isOpen}
                    closeModal={this.closeModal}
                    setType={this.setType}
                    metamask={this.state.metamask}
                    openComfirm={this.callBackModal}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    api: new ServerService(),
    userProfile: state.userProfile,
    accounts: state.accounts,
    ethereum: new EthereumService(state)
});

export default connect(mapStateToProps, null)(ConfirmVerify);
