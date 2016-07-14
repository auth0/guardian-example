import Promise from 'bluebird'
import superagentPromise from 'superagent-promise'
import superagent from 'superagent'
import decode from 'jwt-decode'
import responseErrorHandler from '../helpers/response_error_handler'

const agent = superagentPromise(superagent, Promise)

export const AUTH0 = Symbol('Call Auth0 API')

export default store => next => action => {
  const auth0 = action[AUTH0]

  if (typeof auth0 === 'undefined') {
    return next(action)
  }

  const { endpoint, method, types, data, transformResponse } = auth0
  const { success, error, simulate, revert } = types
  const { transaction: { idToken, domain } } = store.getState()

  const config = {
    getState: store.getState,
    method: method,
    endpoint: endpoint,
    domain: domain,
    idToken: idToken,
    data: data
  }

  if (simulate) {
    store.dispatch(simulate)
  }

  return request(config)
    .then((reponse) => {
      store.dispatch({ type: success, payload: transformResponse ? transformResponse(reponse) : reponse.body })
    })
    .catch((err) => {
      if (responseErrorHandler(err)) { return null }

      if (revert) {
        store.dispatch(revert)
      }

      store.dispatch({ type: error || 'global error', payload: err })
    })
}

function request ({ getState, method, endpoint, domain, idToken, data }) {
  const actualEndpoint = typeof endpoint === 'function'
    ? endpoint({ id: decode(idToken), getState })
    : endpoint
  const url = `https://${domain}/api/v2/${actualEndpoint}`

  return agent((method || 'get').toUpperCase(), url)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${idToken}`)
    .send(data)
    .end()
}
