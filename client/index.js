
import { Router, Route, Redirect, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

import * as TransactionActions from './actions/transaction'
import User from './containers/User'
import Login from './containers/Login'
import StepUp from './containers/StepUp'
import Configuration from './containers/Configuration'
import configure from './store'
import { setup } from './services/lock'

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

const domain = window.auth0Config.domain
const clientId = window.auth0Config.clientId

setup({
  clientId: clientId,
  domain: domain
})

store.dispatch(TransactionActions.configureTransaction({ domain, clientId }))
store.dispatch(TransactionActions.loadTransactionState())

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={User} />
      <Route path='/login' component={Login} />
      <Route path='/configuration' component={Configuration} />
      <Route path='/step-up/:scope' component={StepUp} />
      <Redirect from="/step-up" to="/step-up/update%3Amfa-api" />
    </Router>
  </Provider>,
  document.getElementById('root')
)

