'use strict'

const request = require('request')
const env = require('./env')
const Boom = require('boom')
const urlJoin = require('url-join')

const AUTH0_DOMAIN = env['AUTH0_DOMAIN']
const AUTH0_TENANT = env['AUTH0_TENANT']

module.exports = function (token, method, path, body, cb) {
  request({
    url: urlJoin('https://', AUTH0_DOMAIN.replace('{tenant}', AUTH0_TENANT), 'api/v2', path),
    method: method,
    auth: {
      bearer: token
    },
    json: true,
    body: body
  }, (err, r, body) => {
    if (err) {
      return cb(err)
    }

    if (r.statusCode < 200 || r.statusCode > 300) {
      return cb(Boom.create(body.statusCode || 500, body.message, { errorCode: body.errorCode }))
    }

    cb(null, body)
  })
}
