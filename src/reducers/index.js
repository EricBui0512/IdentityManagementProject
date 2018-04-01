import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import AppReducer from './AppReducer'
import createKeyStore from './createKeyStoreReducer'
import accounts from './accountsReducer'
import global from './globalReducer'
import connection from './connectionReducer'
import importKeystore from './importKeystoreReducer'
import txs from './txsReducer'
import userProfile from './userProfileReducer'
import facet from './facetReducer'
import contacts from './contactsReducer'


const rootReducer = combineReducers({
    AppReducer,
    accounts, global, txs, connection,
    importKeystore,
    createKeyStore,
    userProfile,
    router: routerReducer,
    facet,
    contacts
});

export default rootReducer
