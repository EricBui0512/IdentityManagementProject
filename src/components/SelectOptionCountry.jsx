import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import PropTypes from 'prop-types';

class SelectOptionCountry extends Component{

    constructor(props, context) {
        super(props, context);

        this.state = {
            isLoading: false,
            options: [],
            // text: "Choose...",
            selectValue: "Choose...",
            clearable: false,
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.receivedOptions = this.receivedOptions.bind(this);
        this.updateValue = this.updateValue.bind(this);
    };

    onInputChange (text) {
        this.setState({isLoading: true, options: [], text: text})
        setTimeout(this.receivedOptions, 2000)
    }

    receivedOptions () {
        let options = [
            { value: '1', label: 'Singapore' },
            { value: '2', label: 'Viet Nam' }
        ];
        this.setState({isLoading: false, options: options})
    }

    updateValue (newValue) {
        this.setState({
            selectValue: newValue
        });
    }

    focusStateSelect () {
        this.refs.stateSelect.focus();
    }

    render() {
        return (
            <Select
                ref="stateSelect"
                autofocus
                name="country"
                options={this.state.options}
                simpleValue
                clearable={this.state.clearable}
                disabled={this.state.disabled}
                value={this.state.selectValue}
                onChange={this.updateValue}
                searchable={this.state.searchable}
                onInputChange={this.onInputChange}
                noResultsText={"No Suggestions found"}
            />
        );
    }
}
export default SelectOptionCountry;