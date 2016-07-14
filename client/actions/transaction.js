
import { createAction } from 'redux-actions'
import { browserHistory } from 'react-router'
import lock from '../services/lock'
import { API } from '../middleware/api_call'

export const configureTransaction = createAction('configure transaction')

export function acceptLogin () {
  return function (dispatch) {
    const idtoken = getIdToken()

    if (!idtoken) { return lock().show() }

    return dispatch({
      [API]: {
        endpoint: 'login',
        method: 'POST',
        types: {
          success: 'complete login'
        },
        data: { idtoken },
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

export function stepUp () {
  return function (dispatch) {
    const showLock = function showLock (err, response) {
      if (err) {
        return dispatch({ type: 'global error', payload: err })
      }

      lock().show({
        authParams: {
          state: response.body.transaction_id,
          nonce: response.body.nonce,
          scope: 'openid nonce'
        },
        container: 'lock-step-up-container'
      }, function (err, profile, stepUpidToken, accessCode, state) {
        if (err) {
          return
        }

        dispatch({
          [API]: {
            endpoint: 'step-up/tokens',
            method: 'POST',
            headers: {
              'x-transaction-id': state
            },
            auth: {
              bearer: stepUpidToken
            },
            after: function () {
              browserHistory.push('/configuration')
            }
          }
        })
      })
    }

    return dispatch({
      [API]: {
        endpoint: 'step-up/requests',
        method: 'POST',
        data: { requested_scope: 'update:mfa_settings' },
        after: showLock
      }
    })
  }
}

export function tryAgain () {
  return function (dispatch, getState) {
    const { domain } = getState().transaction

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

function getIdToken () {
  let idToken
  let authHash = lock().parseHash(window.location.hash)
  if (authHash) {
    if (authHash.id_token) {
      idToken = authHash.id_token
    }

    if (authHash.error) {
      return null
    }
  }

  return idToken
}
