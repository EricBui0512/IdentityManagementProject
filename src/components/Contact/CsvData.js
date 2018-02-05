import React, { Component } from 'react';
class CsvData extends Component {
    render() {
        return (
            <div className="panel">
                <div className="panel-heading bg-c7c6c6">
                    <h3 className="mg-0"> CSV Data </h3>
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
                </div>
            </div>
        );
    }
}

export default CsvData;
