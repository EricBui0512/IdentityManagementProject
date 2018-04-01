import EthereumService from "../services/ethereum";

const initState = {
   
}

const connection = (state=initState, action) => {
  if (EthereumService){
    return {ethereum: new EthereumService()}
  }
    
  return state
  // return state
}

export default connection
