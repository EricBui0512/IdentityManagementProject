import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import {connect} from 'react-redux'
import ServerService from '../../../services/server';
import ethereumUtil from 'ethereumjs-util'
class AddFacet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            errors: {
                name: ""
            }
        }
    }
    _onSubmit = (event) => {
        event.preventDefault()
        if (this.state.name === "") {
            this.setState({
                ...this.state,
                errors: {
                    name: "Title is empty"
                }
            })
            return
        } else {
            this.setState({
                ...this.state,
                errors: {
                    name: ""
                }
            })
        }
        let params = this.props.params
        let props  = this.props
        console.log(ethereumUtil)
        let tmpAddress = ethereumUtil.sha3(this.state.name + params.userProfile.accountAddress + Date.now()).toString("hex").substr(0,42);
        this.props.api.createFacet(this.state.name,params.userProfile.accountAddress,tmpAddress).then((json)=>{
            params.facetCallback(json);
        });
        this.props.closeModal()
    }
    render() {
        return (
            <div className="">
                <div className="form-modal">
                    <TextField
                        floatingLabelText="Title"
                        fullWidth={true}
                        value={this.state.name}
                        errorText={this.state.errors.name}
                        onChange={(e) => this.setState({name: e.target.value})}
                    /><br />
                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="SUBMIT"
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
    api: new ServerService()
});

export default connect(mapStateToProps)(AddFacet);
