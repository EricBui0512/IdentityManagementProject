import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import {
    MODAL_CREATE_ACCOUNT_NEXT_ID
} from "../constants";
class ImportAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountName: "",
            fileName: "",
        }
    }
    upload = (e) => {
        this.setState({
            fileName: e.name
        });
    }
    render() {
        return (
            <div className="mh250 pd10">
                <div className="form-dragdrop">
                    <div className="dragDrop-container flexible">
                        <div className="text-center">
                            <a className="font60 default-cursor">
                                <i className="fa fa-hdd-o" aria-hidden="true"></i>
                            </a>
                            {
                                this.state.fileName  === "" ?
                                (
                                    <div>
                                        <p className="bold"> Drop file here to import</p>
                                        <p>or</p>
                                    </div>
                                )
                                :
                                (
                                    <p className="bold">{this.state.fileName}</p>
                                )
                            }

                            <RaisedButton
                                containerElement="label"
                                labelColor="#fff"
                                backgroundColor="#5c57a3"
                                label="Choose file">
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={e => this.upload(e.target.files[0])} />
                            </RaisedButton>
                        </div>

                    </div>
                    <TextField
                        floatingLabelText="Account name"
                        fullWidth={true}
                        value={this.state.accountName}
                        onChange={(e) => this.setState({accountName: e.target.value})}
                    />
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="IMPORT ACCOUNT"
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

export default ImportAccount;
