import {REHYDRATE} from 'redux-persist/constants'
import BigNumber from "bignumber.js"
import GLOBAL from "../constants/globalActions"

const initState = {
  currentBlock: 0,
  connected: true,
  termOfServiceAccepted: false,
  // nodeName: "Infura Kovan",
  // nodeURL: "https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi",
  nodeName: "Infura Rinkeby",
  nodeURL:"https://rinkeby.infura.io/faF0xSQUt0ezsDFYglOe",
  facets: 0,
  contacts: 0,
  verifiers: 0,
  verified: 0,
  rates: {},
}

const global = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      return state
    }
    case GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED: {
      return {...state, currentBlock: action.payload}
    }
    case GLOBAL.GET_NEW_BLOCK_FAILED: {
      return {...state, connected: false}
    }
    case GLOBAL.RATE_UPDATED_FULFILLED: {
      var newRates = {...state.rates}
      var rate = action.payload
      newRates[rate.id()] = rate
      return {...state, rates: newRates }
    }
    case GLOBAL.TERM_OF_SERVICE_ACCEPTED: {
      return {...state, termOfServiceAccepted: true}
    }
    default:
      return state;
  }
  return state
}

export default global
