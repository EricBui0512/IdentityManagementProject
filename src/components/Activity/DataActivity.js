import React, { Component } from 'react';
import _ from 'lodash'
import moment from 'moment'

const DataRow = ({tx}) => {
    return (
        <tr>
            <td>{moment(parseInt(tx.time)).format('LLLL')}</td>
            <td>{tx.type}</td>
            <td><a target="_blank" href={"https://rinkeby.etherscan.io/address/"+tx.from}>{_.truncate(tx.from,40)}</a></td>
            <td><a target="_blank" href={"https://rinkeby.etherscan.io/tx/"+tx.hash}>{_.truncate(tx.hash,40)}</a></td>
            <td>{_.truncate(tx.address,40)}</td>
            <td>{tx.status=="mined"?"Success":"Pending"}</td>
        </tr>
    );
}

class DataActivity extends Component {
    _renderRows = () => {
        var elements = []
        _.forEach(this.props.txs, (tx,index)=>{
            elements.push(
                <DataRow tx={tx} key={index}/>
            )
        })
        return elements
    }
    render() {
        return (
            <div className="block activityContainer">
                <table className="table table-responsive table-hover">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Account</th>
                            <th>Transaction</th>
                            <th>Contract</th>
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

export default DataActivity;
