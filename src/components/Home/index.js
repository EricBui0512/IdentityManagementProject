import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import Modal from "../Modal";
import Dashboard from "./Dashboard";
import {
    MODAL_OWNER_LOGIN,
} from "../Modal/constants";
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type:MODAL_OWNER_LOGIN,
            isOpen: true
        }
    }
    closeModal = () => {
        this.setState({
            isOpen: false
        });
    }
    setType = (type) => {
        this.setState({
            type: type
        });
        return true;
    }

    _renderDashBoard = () => {
        if (this.state.isOpen) {
            return (<div/>)
        }
        return (<Dashboard />);
    }

    render() {
        return (
            <div className="main_container">
                <Header/>
                <div className="right-col">
                    <div className="row">
                        <Navigation />
                    </div>
                    { this._renderDashBoard() }
                </div>
                <Modal
                    type={this.state.type}
                    isOpen={this.state.isOpen}
                    closeModal={this.closeModal}
                    setType={this.setType}
                />
            </div>
        );
    }
}

export default Home;
