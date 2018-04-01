import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import DataActivity from "./DataActivity";
import FacetActivity from "./FacetActivity";
import {connect} from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import styles from '../../constants/styles'
import ServerService from "../../services/server"
import { TYPE_FACET, STATUS_AUTHORIZATION_FACET, STATUS_VERIFICATION_FACET } from "./constants";
import _ from "lodash";
import Web3 from "web3";
import { logout } from "../../actions/accountActions"
import Modal from "../Modal";
import {
    MODAL_OWNER_LOGIN,
    MODAL_CREATE_ACCOUNT,
    MODAL_METAMASK,
} from "../Modal/constants";
class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            facet: {},
            type:MODAL_OWNER_LOGIN,
            isOpen: false,
            metamask: false,
        };
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
    handleLogout = () => {
        this.props.logout();
    }
    handleLogin = () => {
        this.setType(MODAL_OWNER_LOGIN);
    }
    callApi = (address) => {
        this.props.api.getListFacetActivities(address).then((data) => {
            this.setState({
                facet: data
            });
        });
    }
    componentDidMount() {
        let address = this.getAccountAddress(this.props);
        if (address === undefined) {
            return;
        }
        this.callApi(address);
    }
    componentWillReceiveProps(nextProps) {
        let address = this.getAccountAddress(nextProps);
        if (address === undefined) {
            return;
        }
        this.callApi(address);
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

    getAccountAddress = (props) => {
        let address = "";
        if (props.appReducer.isMetamask) {
          var web3js = null;
          if (typeof window.web3 !== 'undefined') {
              web3js = new Web3(window.web3.currentProvider);
              address = web3js.eth.accounts[0];
          } else {
              alert('No web3? You should consider trying MetaMask!');
              return;
          }
        } else {
          if (!_.isEmpty(props.accounts.accounts)) {
             address = Object.keys( props.accounts.accounts)[0];
         }
        }
        if (address.length === 0 && !_.isUndefined(props.userProfile.data)) {
          address = props.userProfile.data.accountAddress;
        };
        return address;

    }
    render() {
        return (
            <div className="main_container">
                <Header/>
                <div className="right-col">
                    <div className="row">
                        <Navigation userProfile={this.props.userProfile} handleLogout={this.handleLogout} accounts={this.props.accounts.accounts} handleLogin={this.handleLogin}/>
                    </div>
                    <div className="row pd30 content pd10-767">
                        <div className="col-md-12">
                            <Tabs
                                tabItemContainerStyle={styles.tabItemContainerStyleGrey}
                                contentContainerStyle={styles.contentContainerStyle}
                            >
                                <Tab label="Facet Activities">
                                    <div className="pd-20">
                                        <FacetActivity
                                            data={this.state.facet}
                                            constants={{
                                                type:TYPE_FACET,
                                                statusAuthorization:STATUS_AUTHORIZATION_FACET,
                                                statusVerification:STATUS_VERIFICATION_FACET
                                            }}
                                        />
                                    </div>
                                </Tab>
                                <Tab label="Logs">
                                    <div className="pd-20">
                                        <DataActivity txs={this.props.txs}/>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
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
    txs: state.txs,
    api: new ServerService(),
    accounts: state.accounts,
    userProfile: state.userProfile,
    appReducer: state.AppReducer
});
const mapDispatchToProps = dispatch => {
    return {
        logout: () => {dispatch(logout())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
