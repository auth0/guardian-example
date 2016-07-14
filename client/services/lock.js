
let clientId
let domain

export function setup ({ domain: iDomain, clientId: iClientId }) {
  clientId = iClientId
  domain = iDomain
}

export default function get () {
  return new Auth0Lock(clientId, domain)
}

