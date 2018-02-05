import React, { Component } from 'react';
class Dashboard extends Component {
    render() {
        return (
            <div className="row pd30 content pd10-767">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-4ad4b9 color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10">2</h2>
                                <h2  className="mgt-10 mgr-10">Facets</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40"><i className="fa fa-pie-chart"></i></h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-6cbbff color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10">5</h2>
                                <h2  className="mgt-10 mgr-10">Contacts</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40"><i className="fa fa-address-book"></i></h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-fec16b color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10">54</h2>
                                <h2  className="mgt-10 mgr-10">Verifiers</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40"><i className="fa fa-circle-o"></i></h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3 pd-15">
                            <div className="bg-fd6c6c color-fff flexible pd-20">
                                <h2 className="mgt-10 mgr-10">26</h2>
                                <h2  className="mgt-10 mgr-10">Verified</h2>
                                <h2 className="margin-auto mgt-10"> </h2>
                                <h2  className="mgt-10 font-40"><i className="fa fa-check-circle-o"></i></h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 mgt-30">
                    <div className="panel">
                        <div className="panel-heading flexible padding-0-10 bg-c7c6c6">
                            <h3 className="mgt-10"> User Profile </h3>
                            <h3 className="margin-auto mgt-10"> </h3>
                            <a className="mgt-10 font-40 color-fff">
                                <i className="fa fa-pencil-square-o"></i>
                            </a>
                        </div>
                        <div className="panel-body pd-25">
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">account address</p>
                                <p className="col-sm-9">4, Leng Kee Road #06-07 SiS Building Singapore </p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">ethe balance</p>
                                <p className="col-sm-9">1000</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">id coin balance</p>
                                <p className="col-sm-9">1609</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">user profile address</p>
                                <p className="col-sm-9">Next Id</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">name</p>
                                <p className="col-sm-9">Olinda Cho</p>
                            </div>
                            <div className="row mgb-10">
                                <p className="col-sm-3 uppercase color-77808c">email</p>
                                <p className="col-sm-9">olinda.cho@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
