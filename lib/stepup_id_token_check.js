'use strict'
const jwt = require('express-jwt')
const env = require('./env')

module.exports = jwt({
  secret: new Buffer(env['AUTH0_SECRET'], 'base64'),
  audience: env['AUTH0_CLIENT'],
  requestProperty: 'stepup_idtoken',
  getToken: function fromHeader (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      console.log('Auth Token', req.headers.authorization.split(' ')[1]);
      return req.headers.authorization.split(' ')[1]
    }

    return null
  }
})

