import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FACET from "../../constants/facetActions"
import _ from "lodash"
import FacetActivity from './FacetActivity';
import CryptoJS from 'crypto-js'
import constants from '../../services/constants';
import { shareData, revokeShare, syncFacetFields } from '../../actions/facetActions';
import {
    MODAL_ADD_FIELD,
    MODAL_EDIT_FIELD,
    MODAL_DELETE_FIELD,
    MODAL_SHARE_DATA,
    MODAL_VERIFY,
    MODAL_CONFIRM_TRANSACTION,
    TX_TYPE_REVOKE
} from "../Modal/constants"
import Modal from "../Modal"

const PlainTextField = ({field, deleteField, editField}) => {
    return (
        <tr>
            <td>{field.name}</td>
            <td>
                {
                    (_.includes(field.value,"http://") || _.includes(field.value,"https://")) ?(
                        <p className="col-sm-9"><a href={field.value} target="_blank">{field.value}</a></p>
                    ): (
                        <p className="col-sm-9">{field.value}</p>
                    )
                }
            </td>
            <td className="">
                <a className="btn btn-danger custom-button pull-right" onClick={() => deleteField(field,'text')}>delete</a>
                <a className="btn btn-info custom-button pull-right" onClick={() => editField(field,'text')}>edit</a>
            </td>
        </tr>
    );
}
const LinkField = ({field, downloadFacetFile, deleteField, editField}) => {
    // console.log(decrypt(field.value));
    return (
        <tr>
            <td>{field.name}</td>
            <td>
                <a className="" onClick={(e) => downloadFacetFile(e, field.value)} href={field.value}>
                    <i className="fa fa-download mgr-5"></i>Download
                </a>
            </td>
            <td>
                <a className="btn btn-danger custom-button pull-right" onClick={() => deleteField(field, 'file')}>delete</a>
                <a className="btn btn-info custom-button pull-right" onClick={() => editField(field, 'file')}>edit</a>
            </td>
        </tr>
    );
}
const Field = ({field, prefix, downloadFacetFile, deleteField, editField}) => {
    let type = prefix.substr(0,2);
    if (type === "Tx"){
        return (
            <PlainTextField field={field} editField={editField} deleteField={deleteField}/>
        );
    }
    return (
        <LinkField field={field} downloadFacetFile={downloadFacetFile} editField={editField} deleteField={deleteField}/>
    );
};

class Facet extends Component {
    constructor(props){
        super(props)
        this.state = {
            type: MODAL_ADD_FIELD,
            isOpen: false,
            action: "add",
            facet: {

            },
            secondModal: {
                isOpen: false,
                type: MODAL_CONFIRM_TRANSACTION,
                address: null,
                email: null,
            }
        }
    }
    _renderFields = () => {
        var elements = []
        _.forEach(this.props.facet.fields, (field,index)=>{
            let value = field.value.substr(3,field.value.length -3);
            elements.push(
                <Field
                    field={{...field, value: this.decrypt(value)}}
                    key={index}
                    prefix={field.value}
                    downloadFacetFile={this.downloadFacetFile}
                    editField={this.editField}
                    deleteField={this.deleteField}
                />
            )
        })
        return elements
    }
    goPrevTab = () => {
        this.props.goPrevTab(this.props.tabSelected - 1);
    }
    deleteFacet = () => {
        this.openSecondModal(MODAL_CONFIRM_TRANSACTION, this.props.userProfile.data.accountAddress, this.state.email, constants.TX_TYPE_DELETE_FACET, this.goPrevTab)
    }
    syncFacetFields = () => {
        this.openSecondModal(MODAL_CONFIRM_TRANSACTION, this.props.userProfile.data.accountAddress, this.state.email, constants.TX_TYPE_SYNC_FACET_FIELD, this.syncFacetFieldsToSql)
    }
    syncFacetFieldsToSql = () => {
        let updatedFields = [];
        let deleteFields = [];
        _.forEach(this.props.facet.changes.updated, (field) => {
            updatedFields.push(field.name);
        });
        _.forEach(this.props.facet.changes.deleted, (field) => {
            deleteFields.push(field);
        });
        this.props.api.syncFacetFields(this.props.facet.facetAddress, updatedFields, deleteFields).then(() => {
            this.props.dispatch(syncFacetFields(this.props.facetIndex));
        });
    }

    _renderFacetActions = () => {
        return (
            <div>
            <a className="btn btn-light btn-small mgr-10" onClick={ () => this.addField() }>
                <i className="fa fa-plus mgr-5"></i>
                Add field
            </a>
            {
                (this.props.facet.changes.updated.length > 0 || this.props.facet.changes.deleted.length > 0) ? (
                    <a className="btn btn-light btn-small mgr-10" onClick={ () => this.syncFacetFields() }>
                        <i className="fa fa-refresh mgr-5"></i>
                        Sync to Ethereum Network
                    </a>
                ): undefined
            }
            {
                (this.props.facet.title !== "Primary") ? (
                     <a className="btn btn-light btn-small" onClick={ () => this.deleteFacet() }>
                        <i className="fa fa-trash mgr-5"></i>
                        Delete Facet
                    </a>
                ) : undefined
            }

            <a className="btn-warning btn mgr-10 pull-right" onClick={()=>this.openModal(MODAL_VERIFY)}><i className="fa fa-plus mgr-5"></i> Add Verifier</a>
            <a className="btn-info btn mgr-10 pull-right" onClick={()=>this.openModal(MODAL_SHARE_DATA)}><i className="fa fa-share mgr-5"></i> Share</a>
            </div>
        )
    }


    openModal = (type) => {
        this.setState({
            ...this.state,
            isOpen: true,
            type: type,
        })
    }

    openSecondModal = (type, address=null, email=null, txType=null,callback, extraData=null) => {
        this.setState({
            secondModal: {
                isOpen: true,
                type: type,
                address: address,
                email: email,
            },
            txType: txType,
            callback:callback,
            extraData:extraData
        });
    }

    closeModal = () => {
        this.setState({
            isOpen: false
        })
    }

    closeSecondModal = () => {
        this.setState({
            secondModal: {
                isOpen: false,
                type: MODAL_CONFIRM_TRANSACTION,
                address: null,
            },
        })
    }

    encrypt = (value) => {
        return CryptoJS.AES.encrypt(value, this.props.facet.facetKey).toString();
    }

    decrypt = (input) => {
        try {
            let bytes  = CryptoJS.AES.decrypt(input, this.props.facet.facetKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            return ""
        }

    }
    downloadFacetFile = (e, url) => {
        e.preventDefault();
        let self = this
        self.props.api.downloadFacetFile(url, self.props.facet.facetKey).then((data) => {
            var a = document.createElement('a');
            a.href = data.url;
            a.download = data.url;
            a.target = "_self";
            a.click();
            a.remove();
        });
    }
    addField = () => {
        this.setState({
            action:"add",
            facet: {
                type: null,
                data: null
            }
        },() => {
            this.openModal(MODAL_ADD_FIELD);
        });
    }
    editField = (field, type) => {
        this.setState({
            action:"edit",
            facet: {
                type: type,
                data: field
            }
        },() => {
            this.openModal(MODAL_EDIT_FIELD);
        });
    }
    deleteField = (field, type) => {
        this.setState({
            action:"delete",
            facet: {
                type: type,
                data: field
            }
        },() => {
            this.openModal(MODAL_DELETE_FIELD);
        });
    }
    shareFacet = (item) => {
        let props = this.props
        if(_.isFunction(this.openSecondModal)) {
            this.openSecondModal(MODAL_CONFIRM_TRANSACTION, item.account, item.email,constants.TX_TYPE_SHARE_DATA,null, {
                email: item.email,
                name: item.name,
                currentDateTime:item.dateTime,
                dateTime: _.now(),
                status:1,
                account: item.account
            });
        }
    }

    revokeFacet = (item) => {
        let props = this.props
        if(_.isFunction(this.openSecondModal)) {
            this.openSecondModal(MODAL_CONFIRM_TRANSACTION, item.accountAddress, item.email,constants.TX_TYPE_REVOKE,null,{
                email: item.email,
                name: item.name,
                dateTime: item.dateTime,
                account: item.account,
                facetAddress:props.facet.facetAddress,
                status: 1
            });
        }
    }
    render() {
        return (
            <div className="pd-20">
                <div className="row mgb-10">
                    <p className="col-sm-3 uppercase color-77808c">Facet Address</p>
                    <p className="col-sm-9">{this.props.facet.facetAddress}</p>
                </div>
                <div className="facet-table">
                <table className="table table-responsive table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._renderFields()}
                    </tbody>
                </table>

                </div>
                {this._renderFacetActions()}
                <FacetActivity facetActivity = {this.props.facet.activity} shareFacet={this.shareFacet} revokeFacet={this.revokeFacet}/>
                <Modal
                    type={this.state.type}
                    isOpen={this.state.isOpen}
                    closeModal={this.closeModal}
                    openModal={this.openSecondModal}
                    params={{
                        facetIndex: this.props.facetIndex,
                        facetAddress:this.props.facet.facetAddress,
                        facetKey:this.props.facet.facetKey,
                        facetFieldCallback: this.props.facetFieldCallback,
                        userProfile: this.props.userProfile.data,
                        encrypt: this.encrypt,
                        action:this.state.action,
                        facet: this.state.facet,
                        api: this.props.api
                    }}
                />
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
                        facetField: this.state.facetField,
                        facetFieldCallback: this.facetFieldCallback,
                        facetAddress:this.props.facet.facetAddress,
                        address: this.state.secondModal.address,
                        facetKey: this.props.facet.facetKey,
                        toEmail: this.state.secondModal.email,
                        facet: this.props.facet,
                        facetIndex: this.props.facetIndex,
                        extraData: this.state.extraData,

                    }}
                />
            </div>
        );
    }
}


export default Facet;
