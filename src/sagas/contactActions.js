import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as actions from '../actions/contactActions'
import FACET from "../constants/facetActions"

function* addContact(action) {
  const { share } = action.payload
  let address = "0x3111156c879f758e9b91c66cb1766c9807942d1b"
  let contact = {
      email: share.email,
      name: share.name,
      accountAddress: share.accountAddress
  }
  yield put(actions.addContact(contact))
}

export function* watchContact() {
  yield takeEvery(FACET.SHARE_PENDING, addContact)
}


