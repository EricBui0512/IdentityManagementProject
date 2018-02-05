import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
class ShareData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactEmail: "",
            initialName: "",
            password: "",
        }
    }
    render() {
        return (
            <div className="mh250 pd10">
                <div className="form-modal">
                    <TextField
                        floatingLabelText="Contact's Email"
                        fullWidth={true}
                        value={this.state.accountName}
                        onChange={(e) => this.setState({contactEmail: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Your Initial Name"
                        fullWidth={true}
                        value={this.state.passpharse}
                        onChange={(e) => this.setState({initialName: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Confirm Password"
                        fullWidth={true}
                        value={this.state.rePasspharse}
                        onChange={(e) => this.setState({password: e.target.value})}
                    />
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="SHARE"
                            labelColor="#fff"
                            backgroundColor="#5c57a3"
                            onClick={() => this.props.closeModal()}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

export default ShareData;
