'use strict'
const jwt = require('express-jwt')
const env = require('./env')

module.exports = jwt({
  secret: env['MY_API_SECRET'],
  audience: env['AUTH0_CLIENT'],
  requestProperty: 'stepup_idtoken',
  getToken: require('./get_token_from_header_or_token')({ property: 'stepup_token' })
})

