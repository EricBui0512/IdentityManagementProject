import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountName: "",
            passpharse: "",
            userName: "",
            email: "",
            gasLimit: "",
            gasPrice: "",
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
                        floatingLabelText="User Name"
                        fullWidth={true}
                        value={this.state.userName}
                        onChange={(e) => this.setState({userName: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Email"
                        fullWidth={true}
                        value={this.state.email}
                        onChange={(e) => this.setState({email: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Gas limit"
                        fullWidth={true}
                        value={this.state.gasLimit}
                        onChange={(e) => this.setState({gasLimit: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Gas price"
                        fullWidth={true}
                        value={this.state.gasPrice}
                        onChange={(e) => this.setState({gasPrice: e.target.value})}
                    /><br />
                    <TextField
                        floatingLabelText="Passpharse"
                        fullWidth={true}
                        value={this.state.Passpharse}
                        onChange={(e) => this.setState({passpharse: e.target.value})}
                    />
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="CREATE AN ACCOUNT"
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

export default CreateAccount;
