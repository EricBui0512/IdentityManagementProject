import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dropzone from 'react-dropzone'
import { addNewField, editField, deleteField} from '../../../actions/facetActions';
import FACET from '../../../constants/facetActions'
import {connect} from 'react-redux'
import _ from 'lodash'
import ServerService from '../../../services/server';
import ethereumUtil from 'ethereumjs-util'
class AddField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            value: "",
            type: this.props.params.facet.type == "file" ? 2 : 1,
            facetKey: this.props.params.facetKey,
            fileName: "",
            errors: {
                name: "",
                value: "",
            }
        }
        if (this.props.params.action != "add") {
            this.state.name = this.props.params.facet.data.name;
            this.state.value = this.props.params.facet.data.value;
        }
    }

    handleChange = (event, index, value) => {
        event.preventDefault()
        this.setState({type: value})
    }

    _onSubmit = (event) => {
        event.preventDefault()
        if (this._validate() === false) {
            return;
        }
        let props = this.props
        let state = this.state
        let prefix = state.type == 1 ? "Tx:" : "Fl:";
        if (props.params.action === "add") {
            if (this.state.fileName.length > 0) {
                this.props.api.upload(state).then(function(data) {
                    var value = props.params.encrypt(data.url);
                    props.dispatch(addNewField(props.params.facetIndex, {
                        name: state.name,
                        value: prefix + value,
                        type: state.type == 1 ?  "FACET.FACET_FIELD_PLAIN_TEXT":"FACET.FACET_FIELD_LINK"
                    }));
                    let params = props.params
                    let fieldValue = prefix + value;
                    let tmpAddress = ethereumUtil.sha3(fieldValue + Date.now()).toString("hex")
                    params.api.addFacetField(params.facetAddress, state.name, tmpAddress, fieldValue);
                });

            } else {
                var value = props.params.encrypt(state.value);
                this.props.dispatch(addNewField(props.params.facetIndex, {
                    name: state.name,
                    value: prefix + value,
                    type: state.type == 1 ?  "FACET.FACET_FIELD_PLAIN_TEXT":"FACET.FACET_FIELD_LINK"
                }))
                let params = props.params
                let fieldValue = prefix + value;
                let fieldvalueHash = "0x"+ethereumUtil.sha3(fieldValue).toString("hex")
                console.log("add field---->",fieldvalueHash,fieldValue)
                params.api.addFacetField(params.facetAddress, state.name, fieldvalueHash, fieldValue);
            }

        } else {
            if (this.state.fileName.length > 0) {
                this.props.api.upload(state).then(function(data) {
                    let fieldValue = prefix + props.params.encrypt(data.url);
                    props.dispatch(editField(props.params.facetIndex, {
                        name: state.name,
                        value: fieldValue,
                        type: state.type == 1 ?  "FACET.FACET_FIELD_PLAIN_TEXT":"FACET.FACET_FIELD_LINK"
                    }))
                    let fieldvalueHash = "0x"+ethereumUtil.sha3(fieldValue).toString("hex")
                    console.log("add field---->",fieldvalueHash,fieldValue)
                    props.api.updateFacetField(props.params.facetAddress, state.name, fieldvalueHash, fieldValue);
                });
            } else {
                var value = props.params.encrypt(state.value);
                let fieldValue = prefix + value;
                let fieldvalueHash = "0x"+ethereumUtil.sha3(fieldValue).toString("hex");
                console.log("add field---->",fieldvalueHash,fieldValue)
                props.api.updateFacetField(props.params.facetAddress, state.name, fieldvalueHash, fieldValue);
                this.props.dispatch(editField(props.params.facetIndex, {
                    name: state.name,
                    value: fieldValue,
                    type: state.type == 1 ?  "FACET.FACET_FIELD_PLAIN_TEXT":"FACET.FACET_FIELD_LINK"
                }))
            }
        }
        props.closeModal()
    }
    _validate = () => {
        let state = this.state;
        if (_.isEmpty(this.state.name)) {
            state = { ...state, errors:  { ...state.errors, name : "Name is not empty"}};
        } else {
            state = { ...state, errors:  { ...state.errors, name : ""}};
        }
        if (state.type == 1) {
            if (_.isEmpty(this.state.value)) {
                state = { ...state, errors:  { ...state.errors, value : "Value is not empty"}};
            } else {
                state = { ...state, errors:  { ...state.errors, value : ""}};
            }
        } else {
            if (state.fileName == ""){
                alert("Please choose a file")
                return false
            }
        }
        this.setState(state)
        return (state.errors.name === "" && state.errors.value === "")
    }

    _onDrop = (files) => {
        var file = files[0]
        console.log(file)
        var fileReader = new FileReader()
        let props = this.props
        fileReader.onload = (event) => {
            var fileData = event.target.result

            let state = this.state
            this.setState({
                ...state,
                fileData: new Buffer(fileData).toString("base64"),
                fileName: file.name,
                mimeType: file.type
            })
        }
        try {
            fileReader.readAsArrayBuffer(file)
        } catch (e) {
        }
    }
    _onSubmitDelete = (e) => {
        e.preventDefault();
        this.props.api.deleteFacetField(this.props.params.facetAddress, this.state.name);
        this.props.dispatch(deleteField(this.props.params.facetIndex, this.state.name));
        this.props.closeModal();
    }

    render() {
        if (this.props.params.action == "delete") {
            return (
                <div className="form-modal mgt-30">
                    <h3 className="mgt-30">You are going to delete facet field : <b>{this.state.name}</b></h3>
                    <div className="flexible mg30-0">
                        <RaisedButton
                            label="Submit"
                            labelColor="#fff"
                            backgroundColor="#5c57a3"
                            onClick={this._onSubmitDelete}
                        />
                    </div>
                </div>
            );
        }

        let uiUpload = "";
        if (this.state.type == 2) {
            uiUpload = (
                <div>
                    <TextField
                        floatingLabelText="Title"
                        fullWidth={true}
                        value={this.state.name}
                        errorText={this.state.errors.name}
                        disabled={this.props.params.action != "add"}
                        onChange={(e) => {
                            e.preventDefault()
                            this.setState({name: e.target.value})
                        }}
                    />
                    <div className="mh250">
                        <div className="form-dragdrop w100p">
                            <Dropzone onDrop={this._onDrop} className="dragDrop-container flexible" style={{minHeight:200}}>
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

                                    <p className="maskButton">{this.state.fileName == "" ? "Choose file" : "re-choose"}</p>
                                </div>
                            </Dropzone>
                        </div>
                    </div>
                </div>
            );
        } else {
            uiUpload = (
                <div>
                    <TextField
                        floatingLabelText="Name"
                        fullWidth={true}
                        value={this.state.name}
                        errorText={this.state.errors.name}
                        disabled={this.props.params.action != "add"}
                        onChange={(e) => {
                            e.preventDefault()
                            this.setState({name: e.target.value})
                        }}
                    /><br />
                    <TextField
                        floatingLabelText="Value"
                        fullWidth={true}
                        value={this.state.value}
                        errorText={this.state.errors.value}
                        onChange={(e) => {
                            e.preventDefault()
                            this.setState({value: e.target.value})
                        }}
                    />
                </div>
            );
        }
        return (
            <div className="mh250 pd10 relative">
                <div className="form-modal">
                    <SelectField
                        floatingLabelText="Type"
                        value={this.state.type}
                        onChange={this.handleChange}
                        fullWidth={true}
                        disabled={this.props.params.action != "add"}
                    >
                        <MenuItem value={1} primaryText="Plain Text" />
                        <MenuItem value={2} primaryText="Document" />
                    </SelectField>

                    {uiUpload}

                    <div className="flexible-end mg30-0">
                        <RaisedButton
                            label="Submit"
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
    api: new ServerService(),
});

export default connect(mapStateToProps)(AddField);
