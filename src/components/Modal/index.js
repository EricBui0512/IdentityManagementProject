import React, { Component } from 'react';
import Modal from "react-modal";
import {
    OWNER_LOGIN,
    CREATE_ACCOUNT,
    EXISTING,
    METAMASK,
    IMPORT_ACCOUNT,
    CREATE_ACCOUNT_NEXT_ID,
    VERIFY,
    SHARE_DATA,
    UPDATE_USER_PROFILE,
    INSUFFICIENT_FUNDS,
    ADD_FIELD,
    ADD_FACET,
    UNLOCK_ACCOUNT,
    EDIT_FIELD,
    DELETE_FIELD,

    MODAL_CREATE_ACCOUNT,
    MODAL_CREATE_ACCOUNT_NEXT_ID,
    MODAL_EXISTING,
    MODAL_METAMASK,
    MODAL_IMPORT_ACCOUNT,
    MODAL_SHARE_DATA,
    MODAL_VERIFY,
    MODAL_UPDATE_USER_PROFILE,
    MODAL_INSUFFICIENT_FUNDS,
    MODAL_ADD_FIELD,
    MODAL_ADD_FACET,
    MODAL_CONFIRM_TRANSACTION,
    CONFIRM_TRANSACTION,
    MODAL_EDIT_FIELD,
    MODAL_DELETE_FIELD,
} from "./constants";
import NewAccount from "./Body/NewAccount";
import OwnerLogin from "./Body/OwnerLogin";
import Existing from "./Body/Existing";
import UnlockMetaMask from "./Body/UnlockMetaMask";
import ImportAccount from "./Body/ImportAccount";
import CreateAccount from "./Body/CreateAccount";
import ShareData from "./Body/ShareData";
import Verify from "./Body/Verify";
import UpdateUserProfile from "./Body/UpdateUserProfile";
import NotEnoughEth from "./Body/NotEnoughEth";
import AddField from "./Body/AddField";
import AddFacet from "./Body/AddFacet";
import ConfirmTransaction from "./Body/ConfirmTransaction";
class ModalCustom extends Component {
    _renderBodyModal = () => {
        switch (this.props.type) {
            case MODAL_CREATE_ACCOUNT:
                return ( <NewAccount setType={this.props.setType} closeModal={this.props.closeModal} /> );
            case MODAL_UPDATE_USER_PROFILE:
                return ( <UpdateUserProfile setType={this.props.setType} closeModal={this.props.closeModal} /> );
            case MODAL_EXISTING:
                return ( <Existing setType={this.props.setType} /> );
            case MODAL_IMPORT_ACCOUNT:
                return ( <ImportAccount setType={this.props.setType} closeModal={this.props.closeModal} openComfirm={this.props.openComfirm} /> );
            case MODAL_METAMASK:
                return ( <UnlockMetaMask setType={this.props.setType} closeModal={this.props.closeModal} openComfirm={this.props.openComfirm} /> );
            case MODAL_CREATE_ACCOUNT_NEXT_ID:
                return ( <CreateAccount setType={this.props.setType} closeModal={this.props.closeModal} metamask={this.props.metamask} /> );
            case MODAL_SHARE_DATA:
                return ( <ShareData openModal={this.props.openModal} setType={this.props.setType} closeModal={this.props.closeModal} params={this.props.params}/> );
            case MODAL_VERIFY:
                return ( <Verify openModal={this.props.openModal} setType={this.props.setType} closeModal={this.props.closeModal} params={this.props.params}/> );
            case MODAL_INSUFFICIENT_FUNDS:
                return ( <NotEnoughEth setType={this.props.setType} closeModal={this.props.closeModal} /> );
            case MODAL_ADD_FIELD:
                return ( <AddField setType={this.props.setType} closeModal={this.props.closeModal} params={this.props.params}/> );
            case MODAL_EDIT_FIELD:
                return ( <AddField setType={this.props.setType} closeModal={this.props.closeModal} params={this.props.params}/> );
            case MODAL_DELETE_FIELD:
                return ( <AddField setType={this.props.setType} closeModal={this.props.closeModal} params={this.props.params}/> );
            case MODAL_ADD_FACET:
                return ( <AddFacet setType={this.props.setType} closeModal={this.props.closeModal} params={this.props.params}/> );
            case MODAL_CONFIRM_TRANSACTION:
                return ( <ConfirmTransaction handleSubmitShareData={this.props.handleSubmitShareData} setType={this.props.setType} closeModal={this.props.closeModal} params={this.props.params}/> );
            default:
                return ( <OwnerLogin setType={this.props.setType} /> );
        }
    }
    _renderTitleModal = () => {
        switch (this.props.type) {
            case MODAL_CREATE_ACCOUNT:
                return CREATE_ACCOUNT;
            case MODAL_EXISTING:
                return EXISTING;
            case MODAL_IMPORT_ACCOUNT:
                return IMPORT_ACCOUNT;
            case MODAL_METAMASK:
                return METAMASK;
            case MODAL_CREATE_ACCOUNT_NEXT_ID:
                return CREATE_ACCOUNT_NEXT_ID;
            case MODAL_SHARE_DATA:
                return SHARE_DATA;
            case MODAL_ADD_FIELD:
                return ADD_FIELD;
            case MODAL_ADD_FACET:
                return ADD_FACET;
            case MODAL_CONFIRM_TRANSACTION:
                return CONFIRM_TRANSACTION;
            case MODAL_VERIFY:
                return VERIFY;
            case MODAL_UPDATE_USER_PROFILE:
                return UPDATE_USER_PROFILE;
            case MODAL_INSUFFICIENT_FUNDS:
                return INSUFFICIENT_FUNDS;
            case MODAL_EDIT_FIELD:
                return EDIT_FIELD;
            case MODAL_DELETE_FIELD:
                return DELETE_FIELD;
            default:
                return OWNER_LOGIN;
        }
    }

    render() {
        return (
            <Modal
                style={customStyles}
                isOpen={this.props.isOpen}
                onRequestClose={this.props.closeModal}
                shouldCloseOnOverlayClick={false}
                >
                <div className="col-xs-12">
                    <div className="row">
                        <div className="mainBg h50 flexible top-modal pd10">
                            <span className="pull-left color-fff title-modal">{this._renderTitleModal()}</span>
                            <span className="mg-auto"></span>
                            <a
                                className="pull-right color-fff pd10 size20 closeModal"
                                onClick={this.props.closeModal}
                            >
                                <i className="fa fa-times"></i>
                            </a>
                        </div>
                        {this._renderBodyModal()}
                    </div>
                </div>
            </Modal>
        );
    }
}
const customStyles = {
    overlay: {
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'background': 'rgba(0, 0, 0, 0.55)',
        'display': 'flex',
        'justifyContent': 'center',
        'alignItems': 'center',
        'zIndex': 300
    },
    content: {
        'width'       : '700px',
        'position'    : 'absolute',
        'padding'     : 0,
        'top'         : '40%',
        'left'        : '50%',
        'right'       : 'auto',
        'bottom'      : 'auto',
        'marginRight' : '-50%',
        'transform'   : 'translate(-50%, -50%)',
        'borderRadius': '20px',

    }
}

export default ModalCustom;
