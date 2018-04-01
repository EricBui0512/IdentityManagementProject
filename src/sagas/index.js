import { fork, all } from 'redux-saga/effects'
import { watchAccount } from './accountActions';
import { watchGlobal } from './globalActions';
import { watchContact } from './contactActions'
import { watchUserProfile } from './facetActions'
import { watchTx } from './txActions'

export default function* root() {
  yield all([
    fork(watchAccount),
    fork(watchGlobal),
    fork(watchContact),
    fork(watchUserProfile),
    fork(watchTx)
  ])
}
