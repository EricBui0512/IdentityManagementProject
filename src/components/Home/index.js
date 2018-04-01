import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import Modal from "../Modal";
import Dashboard from "./Dashboard";
import {connect} from 'react-redux';
import EthereumService from "../../services/ethereum";
import ServerService from '../../services/server';
import {
    MODAL_OWNER_LOGIN,
    MODAL_UPDATE_USER_PROFILE,
    MODAL_METAMASK,
    MODAL_CREATE_ACCOUNT,
    MODAL_CREATE_ACCOUNT_NEXT_ID,
    MODAL_INSUFFICIENT_FUNDS
} from "../Modal/constants";
import _ from "lodash";
import { logout } from "../../actions/accountActions"

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type:MODAL_OWNER_LOGIN,
            isOpen: false,
            metamask: false,
        }
    }
    closeModal = () => {
        this.setState({
            isOpen: false
        });
    }
    setType = (type) => {
        if (type === MODAL_METAMASK) {
            this.setState({
                metamask: true
            });
        } else if (type === MODAL_CREATE_ACCOUNT) {
            this.setState({
                metamask: false
            });
        }
        this.setState({
            type: type,
            isOpen: true,
        });
        return true;
    }
    editUserProfile = () => {
        let emailProfile = this.props.userProfile.data.email
        if (emailProfile === "" || emailProfile === undefined) {
            let address = Object.keys( this.props.accounts.accounts)[0];
            this.props.ethereum.getBalance(address, this.getBalance);
        } else {
            this.setType(MODAL_UPDATE_USER_PROFILE);
        }
    }
    getBalance = (balance) => {
        if (balance === 0) {
            this.setType(MODAL_INSUFFICIENT_FUNDS);
        } else {
            this.setType(MODAL_CREATE_ACCOUNT_NEXT_ID);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (_.isEmpty(nextProps.userProfile.data)) {
            this.setState({
                isOpen: true,
            });
        } else {
            this.setState({
                isOpen: false,
            });
        }
    }
    componentWillMount() {
        const { userProfile } = this.props;
        if (_.isEmpty(userProfile.data)) {
            this.setState({
                isOpen: true,
            });
        } else {
            this.setState({
                isOpen: false,
            });
        }
    }

    _renderDashBoard = () => {
        if (_.isEmpty(this.props.userProfile.data)) {
            return (<div/>)
        }
        return (<Dashboard
                    user={this.props.userProfile}
                    accounts={this.props.accounts}
                    editUserProfile={this.editUserProfile}
                    appReducer={this.props.AppReducer}
                    userProfile={this.props.userProfile}
                    global={this.props.global}
                    contacts={this.props.contacts}
                    facet={this.props.facet}
                    api = {this.props.api}
                    setType={this.setType}
                    ethereum={this.props.ethereum}/>);
    }

    handleLogout = () => {
        this.props.logout();
    }

    handleLogin = () => {
        this.setType(MODAL_OWNER_LOGIN);
    }

    render() {
        return (
            <div className="main_container">
                <Header/>
                <div className="right-col">
                    <div className="row">
                        <Navigation userProfile={this.props.userProfile} handleLogout={this.handleLogout} accounts={this.props.accounts.accounts} handleLogin={this.handleLogin}/>
                    </div>
                    { this._renderDashBoard() }
                </div>
                <Modal
                    type={this.state.type}
                    isOpen={this.state.isOpen}
                    closeModal={this.closeModal}
                    setType={this.setType}
                    metamask={this.state.metamask}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    AppReducer: state.AppReducer,
    accounts: state.accounts,
    global: state.global,
    facet: state.facet,
    contacts: state.contacts,
    api: new ServerService(),
    userProfile: state.userProfile,
    ethereum: new EthereumService(state),
});

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {dispatch(logout())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
