import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifierEmail: "",
            password: "",
        }
    }
    render() {
        return (
            <div className="mh250 pd10">
                <div className="form-modal">
                    <TextField
                        floatingLabelText="Verifier's Email"
                        fullWidth={true}
                        value={this.state.accountName}
                        onChange={(e) => this.setState({verifierEmail: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Confirm Password"
                        fullWidth={true}
                        value={this.state.rePasspharse}
                        onChange={(e) => this.setState({password: e.target.value})}
                    />
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="INVITE"
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

export default Verify;
