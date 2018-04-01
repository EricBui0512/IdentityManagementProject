import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import {connect} from 'react-redux'
import _ from 'lodash'
import  {verifyEmail, verifyNumber } from "../../../utils/validators"
import { addVerifier } from '../../../actions/facetActions';
import constants from '../../../services/constants';
import {
    MODAL_CONFIRM_TRANSACTION,
} from "../../Modal/constants"
import EthereumService from "../../../services/ethereum";
import { addNewToast } from '../../../actions/appAction'
import { toast } from 'react-toastify';

class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            errors: {
                email: "",
            }
        }
    }

    inviteUser(accountAddress) {
        if(_.isFunction(this.props.openModal)) {
            this.props.openModal(MODAL_CONFIRM_TRANSACTION, accountAddress, this.state.email, constants.TX_TYPE_INVITE);
        }

        this.props.dispatch(addVerifier(this.props.params.facetIndex,{
            email: this.state.email,
            dateTime: _.now(),
            account: accountAddress,
            status:1,
        }))

        this.props.closeModal()
    }

    _onSubmit = (event) => {
        event.preventDefault()

        if (this._validate() === false)
            return

        let findAccountByEmailResult = this.props.ethereum.findAccountByEmail(this.state.email);

        findAccountByEmailResult.then(response => {
            if (response === this.props.userProfile.data.accountAddress) {
                this.props.addNewToast({
                    message: "You can't be verified by yourself",
                    option: {
                        type: toast.TYPE.ERROR,
                        autoClose: '2000'
                    },
                })
                return;
            }
            this.inviteUser(response);
        });
    }
    _validate = () => {
        let state = this.state;
        if (!verifyEmail(this.state.email)) {
            state = { ...state, errors:  { ...state.errors, email : "invalid email"}};
        } else {
            state = { ...state, errors:  { ...state.errors, email : ""}};
        }

        this.setState(state)
        return (state.errors.email === "")
    }
    render() {
        return (
            <div className="mh250 pd10">
                <div className="form-modal">
                    <TextField
                        floatingLabelText="Verifier's Email"
                        fullWidth={true}
                        value={this.state.email}
                        errorText={this.state.errors.email}
                        onChange={(e) => this.setState({email: e.target.value})}
                    /><br />
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="INVITE"
                            labelColor="#fff"
                            backgroundColor="#5c57a3"
                            onClick={this._onSubmit}
                        />
                    </div>
                </div>

            </div>
        );
    }
}
const mapStateToProps = state => ({
    ethereum: new EthereumService(state),
    userProfile: state.userProfile,
});

const mapDispatchToProps = dispatch => {
    return {
      addNewToast: toastData => dispatch(addNewToast(toastData)),
      dispatch: dispatch
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Verify);
