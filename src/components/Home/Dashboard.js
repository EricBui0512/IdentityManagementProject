import React, { Component } from 'react';
import _ from "lodash";
import Web3 from "web3";
import {
    MODAL_METAMASK,
} from "../Modal/constants";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            balance: 0,
            coinBalance: 0,
            address: "",
            totalContact:0,
        };
    }
    componentDidMount() {
      let address = "";
      if (this.props.appReducer.isMetamask) {
        var web3js = null;
        if (typeof window.web3 !== 'undefined') {
            web3js = new Web3(window.web3.currentProvider);
            address = web3js.eth.accounts[0];
        } else {
            alert('No web3? You should consider trying MetaMask!');
            return;
        }
        if (_.isUndefined(address)) {
            this.props.setType(MODAL_METAMASK);
            return;
        }
      } else {
        if (!_.isEmpty(this.props.accounts.accounts)) {
           address = Object.keys( this.props.accounts.accounts)[0];
       }
       if (address.length == 0 && !_.isUndefined(this.props.userProfile.data)) {
         address = this.props.userProfile.data.accountAddress;
       };
      }

      this.props.ethereum.getBalance(address, this.getBalance);
      this.props.ethereum.getNextIdCoinBalance(address, this.getNextIdCoinBalance);
       this.setState({
          address: address
      });

      this.props.api.getFacetFromAccountAddress(address).then((result)=>{
            this.setState({
              totalContact: result.length
          });
      })
    }
    componentWillUnmount(){
        // this.isMounted = false;
    }
    getBalance = (balance) => {
        if (this.refs.myRef){
            this.setState({
                balance: balance
            });
        }
    }
    getNextIdCoinBalance = (balance) => {
        this.setState({
            coinBalance: balance
        });
    }
    getVerifierTotal = () => {
        var count = 0
        _.forEach(this.props.facet.facets,(facet)=>{
            count+= facet.activity.verification.length
        })
        return count
    }
    getVerifiedTotal = () => {
        var count = 0
        _.forEach(this.props.facet.facets,(facet)=>{
            _.forEach(facet.activity.verification, (v)=>{
                if (v.status==2) {
                    count++;
                }
            })
        })
        return count
    }
    render() {
        const { user } = this.props;
        return (
            <div className="row pd30 content pd10-767" ref="myRef">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-4ad4b9 color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10 fcw">{this.props.facet.facets ? this.props.facet.facets.length: 0}</h2>
                                <h2  className="mgt-10 mgr-10 fcw">Facets</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40 fcw"><i className="fa fa-pie-chart"></i></h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-6cbbff color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10 fcw">{this.state.totalContact}</h2>
                                <h2  className="mgt-10 mgr-10 fcw">Contacts</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40 fcw"><i className="fa fa-address-book"></i></h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-fec16b color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10 fcw">{this.getVerifierTotal()}</h2>
                                <h2  className="mgt-10 mgr-10 fcw">Verifiers</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40 fcw"><i className="fa fa-circle-o"></i></h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-fd6c6c color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10 fcw">{this.getVerifiedTotal()}</h2>
                                <h2  className="mgt-10 mgr-10 fcw">Verified</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40 fcw"><i className="fa fa-check-circle-o"></i></h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 mgt-30">
                    <div className="panel">
                        <div className="panel-heading flexible padding-0-10 bg-c7c6c6">
                            <h3 className="mgt-10"> User Profile </h3>
                            <h3 className="margin-auto mgt-10"> </h3>
                            <a className="mgt-10 font-40 color-fff" onClick={this.props.editUserProfile}>
                                <i className="fa fa-pencil-square-o"></i>
                            </a>
                        </div>
                        <div className="panel-body pd-25">
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">account address</p>
                                <p className="col-sm-9">{this.state.address || "N/A"}</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">profile address</p>
                                <p className="col-sm-9">{this.props.userProfile.data.userProfileAddress || "N/A"}</p>
                            </div>

                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">ether balance</p>
                                <p className="col-sm-9">{this.state.balance}</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">id coin balance</p>
                                <p className="col-sm-9">{this.state.coinBalance}</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">name</p>
                                <p className="col-sm-9">{user.data.userName || "N/A"}</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">email</p>
                                <p className="col-sm-9">{user.data.email || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Dashboard;
