import React, { Component } from 'react';
import _ from 'lodash'
import moment from 'moment'

const DataRow = ({data, constants}) => {
    let type = constants.type[data.type];
    return (
        <tr>
            <td>{moment(parseInt(data.dateTime)).format('LLLL')}</td>
            <td>{type}</td>
            <td>{_.truncate(data.facetAddress,40)}</td>
            <td>{_.truncate(data.email,40)}</td>
            <td>{type == "Authorization" ? constants.statusAuthorization[data.status] : constants.statusVerification[data.status]}</td>
        </tr>
    );
}

class FacetActivity extends Component {
    _renderRows = () => {
        var elements = []
        _.forEach(this.props.data, (data,index)=>{
            elements.push(
                <DataRow data={data} key={index} constants={this.props.constants}/>
            )
        })
        return elements
    }
    render() {
        console.log(this.props.constants);
        return (
            <div className="block activityContainer">
                <table className="table table-responsive table-hover">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Facet Address</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._renderRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default FacetActivity;
