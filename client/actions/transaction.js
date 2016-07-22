
import { createAction } from 'redux-actions'
import { browserHistory } from 'react-router'
import lock from '../services/lock'
import { API } from '../middleware/api_call'
import * as stepUpTimeout from '../helpers/step_up_timeout'
import _ from 'lodash'

export const configureTransaction = createAction('configure transaction')
export const setTransactionState = createAction('accept transaction state')

export function loadTransactionState() {
  return function (dispatch, getState) {
    try {
      const tx = JSON.parse(localStorage.tx);
      if (!_.isObject(tx)) { return }

      dispatch(setTransactionState(tx))

      stepUpTimeout.start(tx.stepup, { dispatch, getState });
    } catch (e) {
      // Ignore errors, we cannot load session
    }
  }
}

export function delTransactionState() {
  delete localStorage.tx;

  return { type: 'remove login' }
}

export function acceptLogin ({ idToken }) {
  return function (dispatch) {
    return dispatch({
      [API]: {
        endpoint: 'login',
        method: 'POST',
        types: {
          start: { type: 'start login' },
          success: 'complete login'
        },
        data: { idtoken: idToken },
        after: function (err) {
          if (err) {
            return
          }

          browserHistory.push('/')
        }
      }
    })
  }
}

export function acceptStepUp ({ state, stepUpidToken }) {
  return function(dispatch, getState) {
    stepUpTimeout.clear()

    const scopes = getState().transaction.stepup.requestedScopes

    return dispatch({
      [API]: {
        endpoint: 'step-up/tokens',
        method: 'POST',
        headers: {
          'x-transaction-id': state
        },
        types: {
          success: { type: 'complete stepup', payload: scopes }
        },
        data: { idtoken: stepUpidToken },
        after: function (err, response, store) {
          if (err) { return; } // Ignore error, do nothing

          browserHistory.push('/configuration')

          const stepup = {
            scopes,
            createdAt: Date.now(),
            expiresIn: (response.body || {}).expires_in
          }

          localStorage.tx = JSON.stringify({ stepup: stepup })

          stepUpTimeout.start(stepup, store)
        }
      }
    })
  }
}

export function requestStepUp ({ scope }) {
  return {
    [API]: {
      endpoint: 'step-up/requests',
      method: 'POST',
      data: { requested_scope: scope },
      types: {
        success: 'request stepup'
      },
      transformResponse: function transformResponse (response) {
        return { transactionId: response.body.transaction_id, nonce: response.body.nonce, scopes: scope ? [ scope ] : [] }
      }
    }
  }
}

export function tryAgain () {
  return function (dispatch, getState) {
    const { domain } = getState().transaction

    dispatch(delTransactionState())

    return dispatch({
      [API]: {
        endpoint: 'logout',
        method: 'POST',
        types: {
          success: 'logout'
        },
        after: function (err) {
          if (err) {
            dispatch({ type: 'global error', payload: { err: err } })
          }

          window.location.href = `https://${domain}/v2/logout?returnTo=${encodeURIComponent(window.location.protocol + '//' + window.location.host + '/login')}`
        }
      }
    })
  }
}
