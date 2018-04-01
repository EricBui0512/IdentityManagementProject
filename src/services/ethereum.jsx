import Web3 from "web3"
import Wallet from "ethereumjs-wallet"
import constants from "./constants"

import { updateBlock, updateBlockFailed, updateRate } from "../actions/globalActions"
import { updateAccount } from "../actions/accountActions"
import { updateTx } from "../actions/txActions"
import SupportedTokens from "./supported_tokens"
import * as ethUtil from 'ethereumjs-util'
import store from "../store"
import { sealTxByKeystore } from "../utils/sealer"
import _ from 'lodash'
import ethereumUtil from 'ethereumjs-util'
export default class EthereumService {
  constructor() {
    if (typeof Web3 !== 'undefined') {
      this.rpc = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/faF0xSQUt0ezsDFYglOe"))
    } else {
      console.error("No Web3 detected");
    }

    this.erc20Contract = this.rpc.eth.contract(constants.ERC20)
    this.networkAddress = constants.NETWORK_ADDRESS
    this.networkContract = this.rpc.eth.contract(constants.NEXTID_NETWORK).at(this.networkAddress)
    this.userProfileContract = this.rpc.eth.contract(constants.NEXTID_USER_PROFILE)
    this.facetContract = this.rpc.eth.contract(constants.NEXTID_FACET)
    this.intervalID = null
  }

  version() {
    return this.rpc.version.api
  }

  getLatestBlockPromise(ethereum) {
    return new Promise((resolve, reject) => {
      ethereum.rpc.eth.getBlock("latest", false, (error, block) => {
        if (error != null) {
          console.log(error)
        } else {
          resolve(block.number)
        }
      })
    })
  }
  //
  getLatestBlock(callback) {
    return this.rpc.eth.getBlock("latest", false, (error, block) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(block.number)
      }
    })
  }
  //
  getBalance(address, callback) {
    this.rpc.eth.getBalance(address, (error, balance) => {
      if (error != null) {
        console.log(error)
      } else {
        let weiBalance = balance.toNumber()
        let ethBalance = this.rpc.fromWei(weiBalance)
        callback(ethBalance)
      }
    })
  }
  getNextIdCoinBalance(address, callback) {
    callback(0);
  }
  //
  getNonce(address, callback) {
    this.rpc.eth.getTransactionCount(address, "pending", (error, nonce) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(nonce)
      }
    })
  }
  //
  getTokenBalance(address, ownerAddr, callback) {
    var instance = this.erc20Contract.at(address)
    instance.balanceOf(ownerAddr, (error, result) => {
      if (error != null) {
        console.log(error)
      } else {
        callback(result)
      }
    })
  }
  //
  watch() {
    this.rpc.eth.filter("latest", this.actAndWatch.bind(this), (error) => {
      // the node is not support for filtering
      this.fetchData()
      this.intervalID = setInterval(this.fetchData.bind(this), 10000)
    })
  }

  fetchTxsData = () => {
    console.log('fetch tx data')
    var state = store.getState()
    var tx
    var txs = state.txs
    var ethereum = state.connection.ethereum
    Object.keys(txs).forEach((hash) => {
      tx = txs[hash]
      if (tx.status == "pending") {
        store.dispatch(updateTx(ethereum, tx))
      }
    })
  }

  fetchData() {
    this.fetchTxsData()
  }
  //
  actAndWatch(error, result) {
    if (error != null) {
      store.dispatch(updateBlockFailed(error))
    } else {
      this.fetchData()
    }
  }
  txMined(hash, callback) {
    this.rpc.eth.getTransactionReceipt(hash, (error, result) => {
      if (error != null) {
        console.log(error)
      } else {
        result == null ? callback(false, undefined) : callback(true, result)
      }
    })
  }
  sendRawTransaction(tx, ethereum, txParams, isMetaMask = false) {
    if (isMetaMask == false) {
      return new Promise((resolve, rejected) => {
        ethereum.rpc.eth.sendRawTransaction(
          ethUtil.bufferToHex(tx.serialize()), (error, hash) => {
            if (error != null) {
              rejected(error)
            } else {
              resolve(hash)
            }
          })
      })
    } else {
      return new Promise((resolve, rejected) => {
        console.log("meta", txParams)
        txParams.gas = txParams.gasLimit
        delete txParams.nonce
        delete txParams.gasLimit
        window.web3.eth.sendTransaction(
          txParams, (error, hash) => {
            if (error != null) {
              rejected(error)
            } else {
              resolve(hash)
            }
          })
      })
    }
  }

  createNewAddress(passphrase) {
    var newAddress = Wallet.generate()
    return newAddress.toV3(passphrase, { kdf: "pbkdf2", c: 10240 })
  }

  syncTx(txHash, callBack) {
    let self = this;
    this.rpc.eth.getTransactionReceipt(txHash, (error, txData) => {
      if (txData != null) {
        callBack(true, txData)
      } else {
        setTimeout(() => {
          self.syncTx(txHash, callBack)
        }, 1000)
      }
    })
  }
  //NEXTID - User profile
  deployUserProfile(accountAddress, userName, password, email, publicKey, gas, gasPrice, isMetaMask, rejectTransaction, submitTransaction, addUserProfile, getContractAddress, keyStore) {
    let _this = this;
    let baseOpts = {
      from: accountAddress,
      gas: gas,
      gasPrice: gasPrice,
    };
    let self = this;
    let opts = {
      ...baseOpts,
      data: constants.NEXTID_USER_PROFILE_BYTECODE
    };
    let userContractData = this.userProfileContract.new.getData(userName, email, publicKey, constants.NETWORK_ADDRESS, opts)
    console.log(userName, email, publicKey, constants.NETWORK_ADDRESS)
    if (isMetaMask) {
      window.web3.eth.sendTransaction({
        ...baseOpts,
        data: userContractData,
      }, (error, result) => {
        if (typeof result !== 'undefined') {
          submitTransaction();
          self.syncTx(result, (isDone, txData) => {
            console.log('User Profile', error, txData.contractAddress)
            getContractAddress(txData.contractAddress);
            addUserProfile();
          })
        } else {
          rejectTransaction();
        }
      });
    } else {
      let currentCount = this.rpc.eth.getTransactionCount(accountAddress);
      let params = {
        ...opts,
        data: userContractData,
        nonce: currentCount,
      };
      let tx = sealTxByKeystore(params, keyStore, password);
      this.rpc.eth.sendRawTransaction("0x" + tx.serialize().toString("hex"), (err, hash) => {
        console.log(err, hash);
        if (hash !== null) {
          submitTransaction();
          self.syncTx(hash, (isDone, txData) => {
            if (typeof txData !== 'undefined' && typeof txData.contractAddress !== 'undefined') {
              console.log('User Profile', txData.contractAddress)
              getContractAddress(txData.contractAddress);
              addUserProfile();
            }
          })
        }
        else {
          rejectTransaction();
        }
      })
    }
  }
  updateUserProfile(accountAddress, userName, email, gas, gasPrice, isMetamask, keyStore, password) {
    let opts = {
      from: accountAddress,
      gas: gas,
      gasPrice: gasPrice,
    };
    let _this = this;
    console.log(accountAddress)
    _this.networkContract.getUserProfile(accountAddress,opts, (error, userProfileAddress) => {
      if (typeof userProfileAddress !== 'undefined') {
        let contract = this.userProfileContract.at(userProfileAddress)
        console.log(contract)
        opts.to = userProfileAddress
        var updatedData = contract.updateUserNameAndEmail.getData(userName, email, opts)
        if (isMetamask) {

          window.web3.eth.sendTransaction({
            ...opts,
            data: updatedData,
          }, (error, result) => {

          })
        } else {
          //sign data to send
          let currentCount = this.rpc.eth.getTransactionCount(accountAddress);
          let params = {
            ...opts,
            data: updatedData,
            nonce: currentCount,
          };
          let tx = sealTxByKeystore(params, keyStore, password);

          //send raw transaction
          this.rpc.eth.sendRawTransaction("0x" + tx.serialize().toString("hex"), (err, hash) => { })
        }
      }
    });
  }
  getUserProfileFromNetwork(accountAddress, callback) {
    this.networkContract.getUserProfile(accountAddress, (error, userProfileAddress) => {
      if (userProfileAddress === constants.EMPTY_ADDRESS)
        callback(constants.EMPTY_ADDRESS, "", "")

      let contract = this.userProfileContract.at(userProfileAddress)
      contract.getUserName((err, userName) => {
        contract.getEmail((err, email) => {
          callback(userProfileAddress, userName, email)
        })
      })
    })
  }

  deployTxByMetaMask(opts, data, callback) {
    console.log(opts)
    opts.gas = opts.gasLimit
    let self = this
    window.web3.eth.sendTransaction({
      ...opts,
      data: data
    }, (error, result) => {
      if (typeof result !== 'undefined') {
        self.syncTx(result, (isDone, txData) => {
          console.log('Contract', txData.contractAddress)
          callback(txData)
        })
      }
    })
  }

  depployTxByDefault(opts, data, password, keyStore, callback) {
    let self = this
    let currentNonce = this.rpc.eth.getTransactionCount(opts.from)
    let params = {
      ...opts,
      data: data,
      nonce: currentNonce
    }
    let tx = sealTxByKeystore(params, keyStore, password)
    let signedData = "0x" + tx.serialize().toString("hex")

    this.rpc.eth.sendRawTransaction(signedData, (err, hash) => {
      console.log(err, params)
      if (hash !== null) {
        self.syncTx(hash, (isDone, txData) => {
          console.log('Contract', txData.contractAddress)
          callback(txData)
        })
      }
    })
  }

  getCurrentNonce(accountAddress) {
    return this.rpc.eth.getTransactionCount(accountAddress)
  }

  //transaction data

  addFacetData(title,profileAddress, opts) {
    return this.facetContract.new.getData(title,profileAddress, { ...opts, data: constants.NEXTID_FACET_BYTECODE })
  }
  destroyFacetData(facetAddress,profileAddress,opts) {
    return this.facetContract.at(facetAddress).destroy.getData(profileAddress,opts)
  }

  updateFacetAttributesData(facetAddress, attributeKeys,attributeValues,deletedKeys,opts) {

    var sha3Keys = []
    var sh3Values = []
    var sh3DeletedKeys = []
    _.forEach(attributeKeys, (key,index) => {
      sha3Keys.push(this.rpc.sha3(attributeKeys[index]))
    })
    _.forEach(attributeValues, (key,index) => {
      sh3Values.push(this.rpc.sha3(attributeValues[index]))
    })
    _.forEach(deletedKeys, (key,index) => {
      sh3DeletedKeys.push(this.rpc.sha3(deletedKeys[index]))
    })
    console.log(sha3Keys,sh3Values,sh3DeletedKeys);

    return this.facetContract.at(facetAddress).updateAttributes.getData(sha3Keys,sh3Values,sh3DeletedKeys,opts)
  }

  deleteFacetAttributesData(facetAddress,attributeKeys,opts) {

    var sha3Keys = []
    _.forEach(attributeKeys, (key,index) => {
      sha3Keys.push(ethUtil.sha3(attributeKeys[index]))
    })

    return this.facetContract.at(facetAddress).deleteAttributes.getData(sha3Keys,opts)

  }

  addFacetToProfileData(facetAddress, userProfileAddress, opts) {
    console.log("addFacetToProfileData", facetAddress, userProfileAddress, opts)
    return this.userProfileContract.at(userProfileAddress).addFacet.getData(facetAddress, opts)
  }
  addFacetFieldData(field, facetAddress, opts) {
    return this.facetContract.at(facetAddress).updateAttribute.getData(field.name, field.value, opts)
  }

  shareToAccountData(accountAddress,facetAddress, shareKey,opts){
    return this.facetContract.at(facetAddress).shareTo.getData(accountAddress,shareKey,opts);
  }

  inviteToVerifyData(accountAddress, facetAddress, shareKey, opts){
    return this.facetContract.at(facetAddress).inviteToVerify.getData(accountAddress, shareKey, opts);
  }

  inviteToVerifyByEmailData(email, facetAddress, shareKey, opts){
    let emailHash = this.rpc.sha3(email);
    return this.facetContract.at(facetAddress).inviteToVerifyByEmail.getData(emailHash, shareKey, opts);
  }

  //query data from ethereum

  getFacetListTotal(userProfileAddress, isMetaMask) {
    return new Promise((resolve, reject) => {
      if (isMetaMask) {
        window.web3.eth.contract(constants.NEXTID_USER_PROFILE).at(userProfileAddress).getFacetTotal((e, r) => {
          resolve(r.toNumber())
        })
      } else {
        this.userProfileContract.at(userProfileAddress).getFacetTotal((e, r) => { resolve(r.toNumber()) })
      }
    });
  }

  getFacetAt(index, userProfileAddress, isMetaMask) {
    return new Promise((resolve, reject) => {
      if (isMetaMask) {
        window.web3.eth.contract(constants.NEXTID_USER_PROFILE).at(userProfileAddress).getFacetAt(index,(e, r) => {
          resolve(r)
        })
      } else {
        this.userProfileContract.at(userProfileAddress).getFacetAt(index,(e, r) => { resolve(r) })
      }
    });
  }
  getFacetTitle(facetAddress,isMetaMask){
    return new Promise((resolve, reject) => {
      if (isMetaMask) {
        window.web3.eth.contract(constants.NEXTID_FACET).at(facetAddress).getTitle((e, r) => {
          resolve(r)
        })
      } else {
        this.facetContract.at(facetAddress).getTitle((e, r) => { resolve(r) })
      }
    });
  }
  getFacetFieldTotal(facetAddress,isMetamask){
    return new Promise((resolve, reject) => {
      if (isMetamask) {
        window.web3.eth.contract(constants.NEXTID_FACET).at(facetAddress).getAttributeKeysTotal((e, r) => {
          resolve(r.toNumber())
        })
      } else {
        this.facetContract.at(facetAddress).getAttributeKeysTotal((e, r) => { resolve(r.toNumber()) })
      }
    });
  }

  getFacetFieldKeyAt(index,facetAddress,isMetamask){
    return new Promise((resolve, reject) => {
      if (isMetamask) {
        window.web3.eth.contract(constants.NEXTID_FACET).at(facetAddress).getAttributeKeysAt(index,(e, r) => {
          resolve(r)
        })
      } else {
        this.facetContract.at(facetAddress).getAttributeKeysAt(index,(e, r) => { resolve(r) })
      }
    });
  }

  getFacetFieldAttribute(key,facetAddress,isMetamask){
    return new Promise((resolve, reject) => {
      if (isMetamask) {
        window.web3.eth.contract(constants.NEXTID_FACET).at(facetAddress).getAttribute(key,(e, r) => {
          resolve(r)
        })
      } else {
        this.facetContract.at(facetAddress).getAttribute(key,(e, r) => { resolve(r) })
      }
    });
  }

  findAccountByEmail(email) {
    return new Promise((resolve, reject) => {
      this.networkContract.getAccountByEmail(email,(e, r) => { resolve(r) })
    });
  }

  revokeShareData(address, facetAddress, opts) {
    return this.facetContract.at(facetAddress).revokeShare.getData(address,opts)
  }
  verifyFacetByEmail(email, facetAddress, status, opts) {
    let emailHash = this.rpc.sha3(email);
    return this.facetContract.at(facetAddress).verifyByEmail.getData(emailHash, status,opts)
  }
  verifyFacetByAccount(accountAddress, facetAddress, status, opts) {
    return this.facetContract.at(facetAddress).verifyByAccount.getData(status,opts)
  }

}
