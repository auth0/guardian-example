
import { createStore, applyMiddleware } from 'redux'

import { logger, auth0Call, apiCall } from '../middleware'
import rootReducer from '../reducers'
import promiseMiddleware from 'redux-promise'
import thunk from 'redux-thunk'

export default function configure (initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    auth0Call,
    apiCall,
    thunk,
    promiseMiddleware,
    logger
  )(create)

  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
