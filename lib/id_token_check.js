'use strict'
const jwt = require('express-jwt')
const env = require('./env')

module.exports = jwt({
  secret: new Buffer(env['AUTH0_SECRET'], 'base64'),
  audience: env['AUTH0_CLIENT'],
  getToken: require('./get_token_from_header_or_token')({ property: 'id_token' })
})
