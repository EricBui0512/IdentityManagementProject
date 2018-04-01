// props.dispatch(initFacet(userProfile))
import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/facetActions'
import { addKeysToUserProfile } from '../actions/userProfileActions'
import USER_PROFILE from "../constants/userProfile"
import FACET from "../constants/facetActions"
import ServerService from "../services/server"
import { addFacetToProfile, getFacetListTotal } from '../services/facet';
import { addTx } from '../actions/txActions';
import Tx from '../services/tx';
import EthereumService from '../services/ethereum';

function *initFacets(action) {
  console.log("initFacets",action.payload)
  let userProfile = action.payload

  let api = new ServerService()
  let keys = yield call([api, api.retreiveAccount], userProfile.accountAddress, userProfile.email, userProfile.userName)
  yield put(actions.initFacet({...userProfile,...keys}))
  yield put(addKeysToUserProfile(keys))
}

function *saveFacet(action) {

}

function *deleteFacet(action){
  let facetAddress = action.payload
  let api = new ServerService()
  yield call([api,api.deleteFacet],facetAddress)
}
function *revokeFacet(action){
  let facetAddress = action.payload
  let api = new ServerService()
  yield call([api,api.revokeFacet],facetAddress)
}

function *loadFacets(action) {
  let { userProfileAddress, isMetamask, accountAddress } = action.payload
  let ethereum = new EthereumService({})
  let api = new ServerService()
  const total = yield call([ethereum,ethereum.getFacetListTotal],userProfileAddress,isMetamask)
  var facets = []
  for(var i =0; i< total; i++){
    let facetAddress = yield call([ethereum,ethereum.getFacetAt],i, userProfileAddress,isMetamask)
    try {
      let facet = yield call([api,api.loadFacet],facetAddress)
      facets.push(facet)
    } catch (ex){
      console.log(ex)
    }
  }
  yield put(actions.loadFacetsFromEthereum(facets))
}

export function* watchUserProfile() {
  yield takeEvery(USER_PROFILE.CREATE, initFacets)
  yield takeEvery(FACET.REVOKE_SHARE, revokeFacet)
  yield takeEvery(FACET.NEW_FINISHED, saveFacet)
  yield takeEvery(FACET.DELETE_FACET, deleteFacet)
  yield takeEvery(FACET.INIT, loadFacets)
  yield takeEvery(FACET.INIT_WITHOUT_RESET, loadFacets)
}
