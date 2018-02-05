import React from "react"
import { connect } from "react-redux"

import { hideControl, showControl } from "../../actions/utilActions"

class ToggleButton extends React.Component {

  toggleControl = (event) => {
    if(this.props.utils.showControl) {
      this.props.dispatch(hideControl())
    }else{
      this.props.dispatch(showControl())
    }
  }

  render() {
    return (
      <button className="import" onClick={this.toggleControl} >
        <i className="k-icon k-icon-btn-green"></i>
      </button>
    )
  }
}
//
// @connect((store) => {
//     return {
//         utils:store.utils
//     }
// })

const mapStateToProps = (state) => {
    return {...state.importKeystore}
};

export default connect(mapStateToProps)(ToggleButton);