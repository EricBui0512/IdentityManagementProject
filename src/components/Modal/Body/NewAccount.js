import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import {
    MODAL_CREATE_ACCOUNT_NEXT_ID
} from "../constants";
class NewAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountName: "",
            passpharse: "",
            rePasspharse: "",
        }
    }
    render() {
        return (
            <div className="mh250 pd10">
                <div className="form-modal">
                    <TextField
                        floatingLabelText="Account name"
                        fullWidth={true}
                        value={this.state.accountName}
                        onChange={(e) => this.setState({accountName: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Passpharse"
                        fullWidth={true}
                        value={this.state.passpharse}
                        onChange={(e) => this.setState({passpharse: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Retype Passpharse"
                        fullWidth={true}
                        value={this.state.rePasspharse}
                        onChange={(e) => this.setState({rePasspharse: e.target.value})}
                    />
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="CREATE AN ACCOUNT"
                            labelColor="#fff"
                            backgroundColor="#5c57a3"
                            onClick={() => this.props.setType(MODAL_CREATE_ACCOUNT_NEXT_ID)}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

export default NewAccount;
