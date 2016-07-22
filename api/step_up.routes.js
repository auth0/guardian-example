const express = require('express')
const asyncHandler = require('../lib/async_handler')
const env = require('../lib/env')
const urls = require('../lib/urls')
const loadTransaction = require('../lib/middlewares/load_transaction')
const Boom = require('boom')
const randomstring = require('randomstring')
const ms = require('ms')
const tokens = require('../lib/tokens')
const tokenChecker = require('../lib/middlewares/token_checker')
const authorization = require('../lib/middlewares/authorization')
const _ = require('lodash')

const idTokenCheck = tokenChecker.id({ unauthorizedErrorCode: 'invalid_step_up' })
const apiTokenCheck = tokenChecker.api()
const apiGuard = authorization.api()

const STEP_UP_TOKEN_EXPIRES_IN = env['STEP_UP_TOKEN_EXPIRES_IN']

module.exports = function () {
  const app = express.Router()

  app.use('/api/step-up', apiTokenCheck, apiGuard.check('step_up'))

  app.post('/api/step-up/requests',
    checkAllowedScopes,
    asyncHandler(function (req, res) {
      const nonce = randomstring.generate(100)
      const transactionId = randomstring.generate(10)

      req.session = req.session || {};
      req.session[transactionId] = {
        nonce: nonce,
        requested_scope: req.body.requested_scope
      }

      return {
        code: 200,
        object: {
          nonce: nonce,
          transaction_id: transactionId,
          requested_scope: req.body.requested_scope
        }
      }
    }))

  app.post('/api/step-up/tokens',
    idTokenCheck,
    loadTransaction({ delete: true }),
    checkStepUpIdToken,
    asyncHandler(function (req, res, next) {
      const expiresIn = STEP_UP_TOKEN_EXPIRES_IN
      const expiresInMs = ms(expiresIn)
      const now = Date.now()

      if (!_.isString(req.pre.transaction.requested_scope)) {
        throw Boom.badRequest('Invalid requested scope')
      }

      if (req.pre.transaction.requested_scope.split(':').length !== 2) {
        throw Boom.badRequest('Invalid requested scope')
      }

      return tokens.api({ scope: [ req.pre.transaction.requested_scope ] }, {
          expiresIn: expiresIn,
          issuer: urls.me(req),
          subject: req.user.sub,
          audience: urls.me(req, '/api')
        })
        .then(stepupToken => {
          res.cookie('stepup_token', stepupToken, {
            expires: new Date(now + expiresInMs),
            secure: !env.isDevelopment,
            httpOnly: !env.isDevelopment
          })

          return {
            code: 200,
            object: { expires_in: expiresInMs }
          }
        })
    }))

  return app
}

function checkStepUpIdToken (req, res, next) {
  if (!req.idtoken) {
    return next(Boom.unauthorized())
  }

  if (req.idtoken.sub !== req.user.sub) {
    return next(Boom.unauthorized())
  }

  if (req.idtoken.nonce !== req.pre.transaction.nonce) {
    return next(Boom.unauthorized())
  }

  return next()
}

function checkAllowedScopes (req, res, next) {
  const currentScopes = Array.isArray(req.user.scope) ? req.user.scope : (req.user.scope || '').split(' ')
  const segments = req.body.requested_scope.split(':')

  // Must be one of the scopes you have permissions to request
  if (currentScopes.indexOf(`stepup:${segments[0]}_${segments[1]}`) < 0) {
    next(Boom.forbidden('requested_scope value is not allowed'))
  }

  next()
}
