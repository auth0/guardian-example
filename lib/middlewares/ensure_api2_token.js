'use strict'

const env = require('../env')
const AUTH0_API_TOKEN = env['AUTH0_API_TOKEN']

module.exports = function ensureApi2Token (req, res, next) {
  req.pre.auth0Api2Token = AUTH0_API_TOKEN
  next()
}
