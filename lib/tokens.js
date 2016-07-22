'use strict'

const env = require('./env')
const Promise = require('bluebird')
const jsonwebtoken = Promise.promisifyAll(require('jsonwebtoken'))

const SECRET = env['MY_API_SECRET']

exports.api = function apiToken(claims, options) {
  return jsonwebtoken.signAsync(claims, SECRET, {
      algorithm: 'HS256',
      expiresIn: options.expiresIn,
      issuer: options.issuer,
      subject: options.subject,
      audience: options.audience
    })
}
