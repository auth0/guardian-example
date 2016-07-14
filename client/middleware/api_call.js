import Promise from 'bluebird'
import superagentPromise from 'superagent-promise'
import superagent from 'superagent'
import decode from 'jwt-decode'
import responseErrorHandler from '../helpers/response_error_handler'
import _ from 'lodash'

const agent = superagentPromise(superagent, Promise)

export const API = Symbol('Call Example API')

export default store => next => action => {
  const api = action[API]

  if (typeof api === 'undefined') {
    return next(action)
  }

  const { endpoint, method, types, data, transformResponse, after, auth, headers } = api
  const { success, error, start } = types || {}
  const { transaction: { idToken, domain } } = store.getState()

  const config = {
    getState: store.getState,
    method: method,
    endpoint: endpoint,
    domain: domain,
    idToken: idToken,
    data: data,
    json: true
  }

  if (auth) {
    config.auth = auth
  }

  if (headers) {
    config.headers = headers
  }

  if (start) {
    store.dispatch(start)
  }

  store.dispatch({ type: 'start transaction blocking' })

  return request(config)
    .then((response) => {
      if (after) { after(null, response) }

      if (success) {
        store.dispatch(typeof success === 'string' ? { type: success, payload: transformResponse ? transformResponse(response) : response.body } : success)
      }

      return null
    })
    .catch((err) => {
      if (responseErrorHandler(err)) { return null }

      if (after) { after(err) }

      store.dispatch({ type: error || 'global error', payload: err })
      return null
    })
    .finally(() => store.dispatch({ type: 'finish transaction blocking' }))
}

function request ({ getState, method, endpoint, domain, idToken, data, headers, auth }) {
  const actualEndpoint = typeof endpoint === 'function'
    ? endpoint({ id: idToken && decode(idToken), getState })
    : endpoint
  const url = `/api/${actualEndpoint}`

  const r = agent(method.toUpperCase(), url).set('Content-Type', 'application/json')

  _.forEach(headers, (value, key) => r.set(key, value))

  if (auth && auth.bearer) {
    r.set('Authorization', `Bearer ${auth.bearer}`)
  }

  return r.send(data).end()
}
