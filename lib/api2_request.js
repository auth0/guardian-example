'use strict'

const env = require('./env')
const Boom = require('@hapi/boom')
const urlJoin = require('url-join')

const AUTH0_DOMAIN = env['AUTH0_DOMAIN']
const AUTH0_TENANT = env['AUTH0_TENANT']

function parseBody (text) {
  if (!text) { return undefined }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

module.exports = function (token, method, path, body, cb) {
  const hasBody = body !== undefined && body !== null
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  }

  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }

  fetch(urlJoin('https://', AUTH0_DOMAIN.replace('{tenant}', AUTH0_TENANT), 'api/v2', path), {
    method: method,
    headers: headers,
    body: hasBody ? JSON.stringify(body) : undefined
  })
    .then((r) => r.text().then((text) => {
      const parsed = parseBody(text)

      if (r.status < 200 || r.status > 300) {
        const details = parsed || {}
        return [new Boom.Boom(details.message, { statusCode: details.statusCode || 500, data: { errorCode: details.errorCode } })]
      }

      return [null, parsed]
    }))
    .then((result) => cb(result[0], result[1]), cb)
}
