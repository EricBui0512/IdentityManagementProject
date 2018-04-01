import React, { Component } from 'react';
class PrimaryData extends Component {
    render() {
        return (
            <div className="panel">
                <div className="panel-heading bg-c7c6c6">
                    <h3 className="mg-0">{this.props.facetTitle}</h3>
                </div>
                <div className="panel-body pd-25">
                    <div className="row mgb-10">
                        <p className="col-sm-3 uppercase color-77808c">facet address</p>
                        <p className="col-sm-9">{this.props.facetAddress}</p>
                    </div>
                    {this.props.renderFacetDatas(this.props.facetData, this.props.facetKey)}
                </div>
            </div>
        );
    }
}

export default PrimaryData;
