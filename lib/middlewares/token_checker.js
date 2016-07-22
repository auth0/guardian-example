'use strict'
const jwt = require('./jwt_check')
const env = require('../env')
const Boom = require('boom');
const urls = require('../urls')

exports.stepUp = function() {
  return function(req, res, next) {
    return ownTokenCheck(req, {
      unauthorizedErrorCode: 'invalid_stepup',
      cookieProperty: 'stepup_token',
      requestProperty: 'stepup'
    })(req, res, next)
  }
}

exports.api = function() {
  return function(req, res, next) {
    return ownTokenCheck(req, {
      unauthorizedErrorCode: 'invalid_login',
      cookieProperty: 'api_token',
      requestProperty: 'user'
    })(req, res, next)
  }
}

exports.id = function(options) {
  options = options || {}

  return jwt({
    secret: new Buffer(env['AUTH0_SECRET'], 'base64'),
    audience: env['AUTH0_CLIENT'],
    requestProperty: 'idtoken',
    getToken: function(req) {
      return req.body && req.body.idtoken
    },
    onUnauthorized: function(err, next) {
      const error = Boom.unauthorized();
      error.output.payload.errorCode = options.unauthorizedErrorCode || 'invalid_login'

      next(error)
    }
  })
}

function ownTokenCheck (req, options) {
  options = options || {}

  return jwt({
    secret: env['MY_API_SECRET'],
    audience: urls.me(req, '/api'),
    requestProperty: options.requestProperty,
    getToken: fromHeaderOrCookie({ property: options.cookieProperty }),
    onUnauthorized: function(err, next) {
      console.log(err)
      const error = Boom.unauthorized();
      error.output.payload.errorCode = options.unauthorizedErrorCode

      next(error)
    }
  })
}

function fromHeaderOrCookie (options) {
  return function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies[options.property]) {
      return req.cookies[options.property]
    }

    return null
  }
}
