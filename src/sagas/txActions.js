import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import {updateTxComplete} from '../actions/txActions'
import {deployPrimaryDataOnUserProfileCompleted} from '../actions/userProfileActions'
import TX from "../constants/txActions"
import { addNewFacet, shareData, revokeShare, reShareData } from '../actions/facetActions';
import _ from 'lodash'
import ServerService from '../services/server';

function* updateTx(action) {

  const {tx, ethereum} = action.payload
  const newTx = yield call(tx.sync, ethereum, tx)

  console.log("updateTx",newTx)

  if (newTx.address && newTx.address != "") {
    if (newTx.type="deploy facet"){
      let data = newTx.data

      let api = new ServerService()
      console.log("[api] upload facet data")
      let newFacet = yield call ([api,api.updateFacet],data.facetAddress,newTx.address)


      if (!_.isEmpty(data)) {
        data.facetAddress = newFacet.facetAddress
        yield put(addNewFacet({facetAddress:newTx.address,...data, ethereum: ethereum}))
        yield put(deployPrimaryDataOnUserProfileCompleted())
      }
    }
  }

  if (newTx.type=="share to account" && !_.isEmpty(newTx.hash) && newTx.status === 'mined') {
    let data = newTx.data

    let api = new ServerService()
    var params = {
        email: data.toEmail,
        dateTime: _.now(),
        account: data.address,
        facetAddress: data.facetAddress,
        status:1
    }
    yield put(shareData("0x", params))
    yield call ([api,api.addActivity], data.facetAddress, 1, data.address, data.fromEmail, 0, data.facetKey, data.publicKey, data.toEmail, data.clientURL, params.dateTime)
  }
  if (newTx.type=="re-share to account" && !_.isEmpty(newTx.hash) && newTx.status === 'mined') {
    let data = newTx.data
    let api = new ServerService()

    var params = {
        share: data.extraData,
        facetIndex: data.facetIndex
    }

    yield put(reShareData(data.facetIndex, params))
    yield call ([api,api.reShareData], params.share)
  }

  if (newTx.type=="invite to verify" && !_.isEmpty(newTx.hash) && newTx.status === 'mined') {
    let data = newTx.data

    let api = new ServerService()
    var dateTime = _.now();
    yield call ([api,api.addActivity], data.facetAddress, 1, data.address, data.fromEmail, 1, data.facetKey, data.publicKey, data.toEmail, data.clientURL, dateTime)
  }
  if (newTx.type=="revoke facet" && !_.isEmpty(newTx.hash) && newTx.status === 'mined') {
    let data = newTx.data
    let paramsRevoke = data.extraData;
    yield put(revokeShare(data.facetIndex, paramsRevoke))
  }

  yield put(updateTxComplete(newTx))
}

export function* watchTx() {
  yield takeEvery(TX.UPDATE_TX_PENDING, updateTx)
}
