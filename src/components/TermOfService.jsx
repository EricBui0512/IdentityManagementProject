import React from "react"
import { connect } from "react-redux"

import { acceptTermOfService } from "../actions/globalActions"



class TermOfService extends React.Component {

  acceptTOS = (event) => {
    event.preventDefault()
    this.props.dispatch(acceptTermOfService())
  }

  declineTOS = (event) => {
    event.preventDefault()
  }

  render() {
    return (
    <div className="term-page">
      <div className="term-wrapper">
      </div>
      <div className="term-content">
        <h2>KyberWallet - Terms of Use</h2>
        <div className="body k-scroll">
          <p>
            Kyber testnet wallet provides a platform for experimenting and understanding
            our exchange and payment services. The current implementation is not
            secure in any way. Using it may cause loss of funds and could compromise
            user privacy. The user bears the sole responsibility for any outcome that
            is using Kyber testnet wallet.
          </p>
          <div className="gap">
          </div>
          <h3 className="warning">
            USE ONLY TESTNET ACCOUNTS!!!
          </h3>
          <h3 className="warning">
            DO NOT USE REAL ETHEREUM ACCOUNTS!!!
          </h3>
        </div>
        <div className="term-btn">
          <button className="decline" onClick={this.acceptTOS}>Accept</button>
        </div>
      </div>
    </div>)
  }
}

export default connect()(TermOfService);