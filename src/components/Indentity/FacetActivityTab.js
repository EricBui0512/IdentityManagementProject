import React, { Component } from 'react';
import {
    MODAL_SHARE_DATA,
    MODAL_VERIFY
} from "../Modal/constants";
import Modal from "../Modal"
import FACET from '../../constants/facetActions'
import _ from 'lodash'
import moment from 'moment'
import { STATUS_VERIFICATION_FACET } from "../Activity/constants";
const TableRow = ({type, item,shareFacet,revokeFacet}) => {
    return (
        <tr>
            <td>{moment(parseInt(item.dateTime || item.time)).format('LLLL')}</td>
            <td>{item.email}</td>
            <td>{item.account}</td>
            <td>
                {
                    type === FACET.FACET_ACTIVITY_AUTHORIZATION ?
                        item.status == 1 ? (
                            <div>
                                <a className="btn btn-info mgr-10" onClick={ ()=>shareFacet(item) } >Re-share</a>
                                <a className="btn btn-danger" onClick={ ()=>revokeFacet(item) }>Revoke</a>
                            </div>
                        )
                        : (
                            <h4 className="mg-0 red-color">Revoked</h4>
                        )
                    : (
                        <span className=""><b>{STATUS_VERIFICATION_FACET[item.status]}</b></span>
                    )
                }

            </td>
        </tr>
    );
}


const TableHead = ({type,res}) => {
    return (
        <thead>
            <tr>
                <th>Time</th>
                <th>Email</th>
                <th>Account Address</th>
                {
                    type === FACET.FACET_ACTIVITY_AUTHORIZATION  ?
                    (
                        <th>Actions</th>
                    ) :
                    (
                        <th>Status</th>
                    )
                }
            </tr>
        </thead>
    )
}

class FacetActivityTab extends Component {

    constructor(props){
        super(props)
        this.state = {
            type: MODAL_SHARE_DATA,
            isOpen: false
        }
    }

    openModal = (type) => {
        //this.setType(MODAL_SHARE_DATA);
        this.setState({
            ...this.state,
            type: type,
            isOpen: true
        })
    }

    closeModal = () => {
        this.setState({
            ...this.state,
            isOpen: false
        })
    }

    _renderRows = () => {
        var elements = []
        let activityType = this.props.type
        _.forEach(this.props.activity,(item, index) => {
            elements.push(
                <TableRow item = {item} type={activityType} shareFacet={this.props.shareFacet} revokeFacet={this.props.revokeFacet} key={index}/>
            )
        })
        return elements
    }

    render() {
            return (
            <div>
                <table className="table table-responsive">
                    <TableHead type={this.props.type}/>
                    <tbody>
                        {this._renderRows()}
                    </tbody>
                </table>
                <Modal
                    type={this.state.type}
                    isOpen={this.state.isOpen}
                    closeModal={this.closeModal}
                />
            </div>

        );

    }
}

export default FacetActivityTab;
