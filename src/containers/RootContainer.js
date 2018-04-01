import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';

import { addNewToast } from '../actions/appAction'
import EthereumService from "../services/ethereum";

class RootContainer extends React.Component {

  componentDidMount() {
    // this.props.addNewToast({
    //   message: 'test',
    // })
    this.props.ethereum.watch()
  }

  componentWillReceiveProps(props){
    if(!_.isUndefined(props.toast)) {
      if(props.toast.message !== '') {
        toast(
          props.toast.message,
          {
            ...props.toast.option,
            onClose: () => this.props.addNewToast({message: ''})
          }
        )
      }
    }
  }

  render() {
    return (
      <div>
        <ToastContainer />
        {
          this.props.children
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    toast: state.AppReducer.toast,
    ethereum: new EthereumService(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addNewToast: toastData => dispatch(addNewToast(toastData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
