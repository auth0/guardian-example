import _ from 'lodash'
//import Auth0Lock from 'auth0-lock'

let clientId
let domain

export function setup ({ domain: iDomain, clientId: iClientId }) {
  clientId = iClientId
  domain = iDomain
}

export default function get (options) {
  return new Auth0Lock(clientId, domain, options)
}
