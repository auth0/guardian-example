
import { Router, Route, browserHistory } from 'react-router'
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

const domain = 'fortune.au.auth0.com'
const clientId = 'JvUmapHeheM4cHkH4gGm4Kp6QrsPkNBI'

setup({
  clientId: clientId,
  domain: domain
})

store.dispatch(TransactionActions.configureTransaction({ domain, clientId }))

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={User} />
      <Route path='/login' component={Login} />
      <Route path='/configuration' component={Configuration} />
      <Route path='/step-up' component={StepUp} />
    </Router>
  </Provider>,
  document.getElementById('root')
)

