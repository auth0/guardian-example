const express = require('express')
const asyncHandler = require('../lib/async_handler')
const env = require('../lib/env')
const idTokenCheck = require('../lib/id_token_check')
const stepUpIdJwtCheck = require('../lib/stepup_id_token_check')
const loadTransaction = require('../lib/middlewares/load_transaction')
const Boom = require('boom')
const randomstring = require('randomstring')
const jsonwebtoken = require('jsonwebtoken')
const ms = require('ms')

const ALLOWED_SCOPES = ['update:mfa_settings']

module.exports = function () {
  const app = express.Router()

  app.use('/api/step-up', idTokenCheck)

  app.post('/api/step-up/requests', checkAllowedScopes, asyncHandler(function (req, res) {
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

  app.post('/api/step-up/tokens', stepUpIdJwtCheck, loadTransaction({ delete: true }),
    checkStepUpIdToken, function (req, res, next) {
      const expiresIn = '5m'

      jsonwebtoken.sign({ scope: req.pre.transaction.requested_scope }, env['MY_API_SECRET'], {
        algorithm: 'HS256',
        expiresIn: expiresIn,
        issuer: req.headers.host,
        subject: req.user.sub,
        audience: env['AUTH0_CLIENT']
      }, (err, stepupToken) => {
        if (err) {
          return next(Boom.badImplementation())
        }

        res.cookie('stepup_token', stepupToken, {
          expires: new Date(Date.now() + ms(expiresIn)),
          secure: !env.isDevelopment,
          httpOnly: !env.isDevelopment
        })

        res.status(200).end()
        next()
      })
    })

  return app
}

function checkStepUpIdToken (req, res, next) {
  if (!req.stepup_idtoken) {
    return next(Boom.unauthorized())
  }

  if (req.stepup_idtoken.sub !== req.user.sub) {
    return next(Boom.unauthorized())
  }

  if (req.stepup_idtoken.nonce !== req.pre.transaction.nonce) {
    return next(Boom.unauthorized())
  }

  return next()
}

function checkAllowedScopes (req, res, next) {
  if (ALLOWED_SCOPES.indexOf(req.body.requested_scope) < 0) {
    next(Boom.badRequest('requested_scope is not valid'))
  }

  next()
}
