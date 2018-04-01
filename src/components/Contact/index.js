import React, { Component } from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import ContactList from "./ContactList";
import PrimaryData from "./PrimaryData";
import { connect } from "react-redux"
import { logout } from "../../actions/accountActions"
import _ from "lodash"
import ServerService from '../../services/server';
import CryptoJS from 'crypto-js'
import Modal from "../Modal";
import {
    MODAL_OWNER_LOGIN,
    MODAL_METAMASK,
    MODAL_CREATE_ACCOUNT,
} from "../Modal/constants";
const FacetField = ({field, value, prefix, downloadFacetFile, facetKey}) => {
    return (
        <div className="row mgb-10">
            <p className="col-sm-3 uppercase color-77808c">{field.name}</p>
            <p className="col-sm-9">
            {
                prefix === "Tx" ?
                (
                        (_.includes(value,"http://") || _.includes(value,"https://")) ?(
                            <a href={value} target="_blank">{value}</a>
                        ): (
                            <span>{value}</span>
                        )
                ):
                (
                    <a className="" onClick={(e) => downloadFacetFile(e, value, facetKey)} href={value}>
                        <i className="fa fa-download mgr-5"></i>Download
                    </a>
                )
            }
            </p>
        </div>
    );
}
class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            facets: [],
            loaded: false,
            active:0,
            type:MODAL_OWNER_LOGIN,
            isOpen: false,
            metamask: false,
        }
        this.firstLoad = false;
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
    viewContact = () => {

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
    componentWillReceiveProps(nextProps) {
        if (_.isEmpty(this.state.data)) {
            this.props.api.getFacetFromAccountAddress(nextProps.userProfile.data.accountAddress).then((data) => {
                this.handleDataFacet(data);
            })
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
    componentDidMount() {
        if (!_.isEmpty(this.props.userProfile.data)) {
            this.props.api.getFacetFromAccountAddress(this.props.userProfile.data.accountAddress).then((data) => {
                this.handleDataFacet(data);
            })
        }

    }
    handleDataFacet = (data) => {
        this.setState(
            {
                data: data
            },() => this.handleCheckOwner(this.state.data[0])
        )
    }
    handleCheckOwner = (contact, active=null) => {
        if (this.state.loaded) {
            this.setState({
                facets : []
            }, () => this.handleLoadFacets(contact));
        } else {
            this.handleLoadFacets(contact);
        }
        if (!_.isNull(active)) {
            this.setState({
                active: active
            });
        }
    }
    handleLoadFacets = (contact) => {
        if (!_.isUndefined(contact)) {
            var owner = contact.owner;
            if (!this.firstLoad) {
                if (!_.isUndefined(this.props.match.params.address)) {
                    owner = this.props.match.params.address;
                }
                this.firstLoad = true;
            }
            _.forEach(this.state.data, (user, index) => {
                if (user.owner === owner) {
                    this.loadFacet(user);
                }
            })
        }
    }

    loadFacet = (facet) => {

        this.props.api.loadFacetByAddress(facet.facetAddress).then((data) => {
            let facets = this.state.facets;
            facets.push({
                facetData: data.revisedFields,
                facetKey: data.facetKey,
                facetAddress: facet.facetAddress,
                facetTitle: facet.title
            });
            this.setState({
                facets: facets,
                loaded: true
            });
        });
    }

    _renderFacetDatas = (facetData, facetKey) => {
        let elements = [];
        _.forEach(facetData, (field,index)=>{
            var value = field.value.substr(3,field.value.length -3);
            var prefix = field.value.substr(0,2);
            elements.push(
                <FacetField
                    key={index}
                    field={field}
                    value={this.decrypt(value, facetKey)}
                    prefix={prefix}
                    downloadFacetFile={this.downloadFacetFile}
                    facetKey={facetKey} />
            )
        });
        return elements;
    }
    downloadFacetFile = (e, url, facetKey) => {
        e.preventDefault();
        this.props.api.downloadFacetFile(url, facetKey).then((data) => {
            var a = document.createElement('a');
            a.href = data.url;
            a.download = data.url;
            a.target = "_self";
            a.click();
            a.remove();
        });
    }
    decrypt = (input, facetKey) => {
        try {
            let bytes  = CryptoJS.AES.decrypt(input, facetKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.log(error);
            return ""
        }

    }
    _renderFacetsOwner = () => {
        let facetsView = [];
        _.forEach(this.state.facets, (data,index)=>{
            facetsView.push(
                <PrimaryData
                    key={index}
                    renderFacetDatas={this._renderFacetDatas}
                    facetData={data.facetData}
                    facetKey={data.facetKey}
                    facetTitle={data.facetTitle}
                    facetAddress={data.facetAddress} />
            )
        });
        return facetsView;
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
                            <div className="row">
                                <div className="col-md-4">
                                    <ContactList
                                        contacts={this.state.data}
                                        handleCheckOwner={this.handleCheckOwner}
                                        active={this.state.active}
                                    />
                                </div>
                                <div className="col-md-8">
                                    {this._renderFacetsOwner()}
                                </div>
                            </div>
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
    AppReducer: state.AppReducer,
    facets: state.facet,
    contacts: state.contacts,
    accounts: state.accounts,
    userProfile: state.userProfile,
    api: new ServerService()
});

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {dispatch(logout())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
