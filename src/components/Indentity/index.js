import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import {Tabs, Tab} from 'material-ui/Tabs';
import Authorization from "./Authorization";
import Profile from "./Profile";
import Verification from "./Verification";
import ConfirmVerify from "./ConfirmVerify";
import Modal from "../Modal";
class Indentity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type:null,
            isOpen: false,
            verify: false,
            initialSelectedIndex:0
        }
    }
    backIndentity = () => {
        this.setState({
            verify: false
        });
    }
    goVerify = () => {
        this.setState({
            verify: true
        });
    }
    closeModal = () => {
        this.setState({
            isOpen: false
        });
    }
    setType = (type) => {
        this.setState({
            type: type
        }, () => this.openModal());
    }
    openModal = () => {
        this.setState({
            isOpen: true
        });
    }
    _renderIndentity = () => {
        if (this.state.verify) {
            return (<ConfirmVerify backIndentity={this.backIndentity} />);
        }
        return (
            <Tabs
                tabItemContainerStyle={styles.tabItemContainerStyle}
                contentContainerStyle={styles.contentContainerStyle}
            >
                <Tab label="Primary Data" >
                    <div className="pd-20">
                        <Profile />
                        <h3>Activites</h3>

                        <div className="container-tabs">
                            <Tabs
                                tabItemContainerStyle={styles.tabItemContainerStyle}
                                contentContainerStyle={styles.contentContainerStyle}
                                initialSelectedIndex={this.state.initialSelectedIndex}
                            >
                                <Tab label="Authorization" >
                                    <div className="pd-20">
                                        <Authorization setType={this.setType} />
                                    </div>
                                </Tab>
                                <Tab label="Verification">
                                    <div className="pd-20">
                                        <Verification setType={this.setType} />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </Tab>

                <Tab label="Medical Records">
                </Tab>

            </Tabs>
        );
    }
    render() {
        return (
            <div className="main_container">
                <Header/>
                <div className="right-col">
                    <div className="row">
                        <Navigation />
                    </div>
                    <div className="row pd30 content pd10-767">
                        <div className="col-md-12">
                            <div className="row container-tabs">
                                {this._renderIndentity()}
                            </div>
                        </div>
                    </div>
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
const styles = {
    tabItemContainerStyle: {
        backgroundColor: "#413d6e",
        width: "400px"
    },
    contentContainerStyle: {
        backgroundColor: "#FFF",
        border: "1px solid #daddeb",
        borderRadius: "5px",
        minHeight: "500px"
    }
};
export default Indentity;
