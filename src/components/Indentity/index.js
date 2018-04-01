import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import { Tabs, Tab } from 'material-ui/Tabs';
import ConfirmVerify from "./ConfirmVerify";
import Modal from "../Modal";
import { connect } from 'react-redux';
import EthereumService from "../../services/ethereum";
import _ from 'lodash'
import styles from '../../constants/styles'
import {
    MODAL_ADD_FACET,
    MODAL_CONFIRM_TRANSACTION,
    MODAL_OWNER_LOGIN
} from "../Modal/constants";
import Facet from './Facet';
import ServerService from '../../services/server';
import constants from '../../services/constants';
import { logout } from "../../actions/accountActions"
import ethereumUtil from 'ethereumjs-util'
import { addNewToast } from '../../actions/appAction'
import { initFacetWithoutReset } from '../../actions/facetActions'
import { toast } from 'react-toastify';
class Indentity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            isOpen: false,
            metamask: false,
            verify: false,
            initialSelectedIndex: 0,
            isOpenFormAdd: false,
            tabSelected: 0,
            secondModal: {
                isOpen: false,
                type: MODAL_CONFIRM_TRANSACTION
            },
            loaded: false
        }
        this.isLoadedProfile = false
    }
    componentDidMount() {
        if(_.isEmpty(this.props.userProfile.data) === false && this.isLoadedProfile === false) {
            this.props.dispatch(initFacetWithoutReset(this.props.userProfile.data))
            this.isLoadedProfile = true
        }
    }
    componentWillReceiveProps(nextProps) {
        if(_.isEmpty(nextProps.userProfile.data) === false && this.isLoadedProfile === false) {
            this.props.dispatch(initFacetWithoutReset(nextProps.userProfile.data))
            this.isLoadedProfile = true
        }
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
            isOpen: false,
            secondModal: {
                isOpen: false
            }
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

    openModalAdd = () => {
        this.setState({
            isOpenFormAdd: true
        });
    }

    closeModalAdd = () => {
        this.setState({
            isOpenFormAdd: false
        });
    }

    addAccount = (type) => {
        this.setState({
            type: type
        }, () => this.openModalAdd());
    }
    goPrevTab = (selected) => {
        this.setState({
            tabSelected:selected
        })
    }

    _renderFacetTabs = () => {
        var elements = []
        console.log("facets", this.props.facets)
        let _this = this
        _.forEach(this.props.facets, (facet, index) => {
            elements.push(
                <Tab label={facet.title} key={index} value={index}>
                    <Facet
                        a={1}
                        dispatch={this.props.dispatch}
                        accounts={this.props.accounts}
                        userProfile={this.props.userProfile}
                        facet={facet}
                        facetIndex={index}
                        facetFieldCallback={_this.facetFieldCallback}
                        api={this.props.api}
                        tabSelected={this.state.tabSelected}
                        goPrevTab={this.goPrevTab}
                        />
                </Tab>
            )
        })
        return elements
    }
    onChangeTab = (e) => {
        this.setState({
            tabSelected:e
        })
    }
    _renderIndentity = () => {
        if (this.state.verify) {
            return (<ConfirmVerify backIndentity={this.backIndentity} api={this.props.api} />);
        }
        return (
            <Tabs
                tabItemContainerStyle={styles.tabItemContainerStyle}
                contentContainerStyle={styles.contentContainerStyle}
                value={this.state.tabSelected}
                onChange={(e) => this.onChangeTab(e)}
            >
                {this._renderFacetTabs()}
            </Tabs>

        );
    }

    _onDeploy = (event) => {

        event.preventDefault()

        if (this.props.userProfile.data.deployingPrimary === true) {
            addNewToast({
                    message: "Primary data is being deployed!!!",
                    option: {
                        type: toast.TYPE.ERROR,
                        autoClose: '2000'
                    },
            })
            return
        }

        let tmpAddress = ethereumUtil.sha3("Primary"+ this.props.userProfile.data.accountAddress + Date.now()).toString("hex").substr(0,42);

        this.props.api.createFacet("Primary",this.props.userProfile.data.accountAddress,tmpAddress).then((json)=>{
            this.setState({
                isOpen: true,
                type: MODAL_CONFIRM_TRANSACTION,
                facet: json
            })
        })

    }
    facetCallback = (facet) => {
        this.setState({
            isOpen: true,
            type: MODAL_CONFIRM_TRANSACTION,
            facet: facet
        })
    }
    facetFieldCallback = (facetField) => {
        this.setState({
            secondModal: {
                isOpen: true,
                type: MODAL_CONFIRM_TRANSACTION,
            },
            facetField: facetField
        })
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
                <Header />
                <div className="right-col">
                    <div className="row">
                        <Navigation userProfile={this.props.userProfile} handleLogout={this.handleLogout} accounts={this.props.accounts.accounts} handleLogin={this.handleLogin}/>
                    </div>
                    <div className="row pd30 content pd10-767">
                        <div className="col-md-12">

                            {this.props.facets && this.props.facets.length > 0 ? (
                                <div className="row">

                                    <div className="col-sm-6">
                                        <h2>Your facets</h2>
                                    </div>
                                    <div className="col-sm-6 ">
                                        <a className="btn-primary btn pull-right" onClick={() => this.setType(MODAL_ADD_FACET)}><i className="fa fa-plus mgr-5"></i> ADD FACET</a>
                                    </div>
                                </div>

                            ) : (
                                    undefined
                                )}

                            {
                                this.props.facets && this.props.facets.length > 0 ? (
                                    <div className="row container-tabs">
                                        {this._renderIndentity()}
                                    </div>
                                ) : (
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="jumbotron">
                                                    <div className="panel panel-primary">
                                                        <div className="panel-heading">
                                                            <h3>Deploy your primary facet to Ethereum</h3>
                                                        </div>
                                                        <div className="panel-body pd-25">
                                                            <div className="row mgb-10">
                                                                <p className="col-sm-3 uppercase color-77808c">account address</p>
                                                                <p className="col-sm-9">{this.props.userProfile.data.accountAddress || "N/A"}</p>
                                                            </div>
                                                            <div className="row mgb-10">
                                                                <p className="col-sm-3 uppercase color-77808c">profile address</p>
                                                                <p className="col-sm-9">{this.props.userProfile.data.userProfileAddress || "N/A"}</p>
                                                            </div>

                                                            <div className="row mgb-10">
                                                                <p className="col-sm-3 uppercase color-77808c">name</p>
                                                                <p className="col-sm-9">{this.props.userProfile.data.userName || "N/A"}</p>
                                                            </div>
                                                            <div className="row mgb-10">
                                                                <p className="col-sm-3 uppercase color-77808c">email</p>
                                                                <p className="col-sm-9">{this.props.userProfile.data.email || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p>
                                                    {
                                                        this.props.userProfile.data.deployingPrimary ? (
                                                            <a className="btn btn-primary btn-lg pull-right" href="#" role="button" onClick={this._onDeploy}>Deploying...</a>
                                                            ) : (
                                                                <a className="btn btn-primary btn-lg pull-right" href="#" role="button" onClick={this._onDeploy}>Deploy</a>
                                                            )
                                                    }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            }

                        </div>
                    </div>
                </div>

                <Modal
                    type={this.state.type}
                    isOpen={this.state.isOpen}
                    closeModal={this.closeModal}
                    setType={this.setType}
                    params={{
                        accounts:this.props.accounts,
                        userProfile: this.props.userProfile.data,
                        txType: constants.TX_TYPE_FACET,
                        facet: this.state.facet,
                        facetCallback:this.facetCallback
                    }}
                />

                <Modal
                    type={this.state.secondModal.type}
                    isOpen={this.state.secondModal.isOpen}
                    closeModal={this.closeModal}
                    setType={this.setType}
                    params={{
                        accounts:this.props.accounts,
                        userProfile: this.props.userProfile.data,
                        txType: constants.TX_TYPE_FACET_FIELD,
                        facetField: this.state.facetField,
                        facetFieldCallback: this.facetFieldCallback
                    }}
                />

            </div>
        );
    }
}

const mapStateToProps = state => ({
    AppReducer: state.AppReducer,
    accounts: state.accounts,
    global: state.global,
    userProfile: state.userProfile,
    facets: state.facet.facets,
    ethereum: new EthereumService(state),
    api: new ServerService()
});

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {dispatch(logout())},
        addNewToast: toastData => dispatch(addNewToast(toastData)),
        dispatch: dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Indentity);
