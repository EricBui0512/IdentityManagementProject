import {compose, applyMiddleware, createStore} from "redux"
//import logger from "redux-logger"
//import thunk from "redux-thunk"
//import promise from "redux-promise-middleware"
import createSagaMiddleware from 'redux-saga'

import {persistStore, autoRehydrate} from 'redux-persist'
import reducer from "./reducers/index"
import history from "./history"
import { routerMiddleware } from 'react-router-redux'

import rootSaga from './sagas'
import reduxReset from 'redux-reset'


const routeMiddleware = routerMiddleware(history)

const sagaMiddleware = createSagaMiddleware()

const middleware = applyMiddleware(
  //thunk,
  sagaMiddleware,
  //logger,
  routeMiddleware,
)

const store = createStore(
  reducer, undefined, compose(middleware,  reduxReset(), autoRehydrate(), window.devToolsExtension ? window.devToolsExtension() : f => f))

sagaMiddleware.run(rootSaga)

persistStore(store, {blacklist: [
  'AppReducer',
  'connection',
  'exchangeForm',
  'paymentForm',
  'joinPaymentForm',
  'createKeyStore',
  'importKeystore',
  'utils',
  ]})

export default store
