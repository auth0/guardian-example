const express = require('express')
const asyncHandler = require('../lib/async_handler')
const ms = require('ms')
const env = require('../lib/env')
const tokens = require('../lib/tokens')
const urls = require('../lib/urls')
const tokenChecker = require('../lib/middlewares/token_checker')
const authorization = require('../lib/middlewares/authorization')

const idTokenCheck = tokenChecker.id()
const apiTokenCheck = tokenChecker.api()
const apiGuard = authorization.api()

// This will probably go in a db or so
const USER_SCOPES = ['stepup:update_mfa_settings', 'read:current_user', 'logout', 'step_up']

const API_TOKEN_UP_EXPIRES_IN = env['API_TOKEN_UP_EXPIRES_IN']

module.exports = function () {
  const app = express.Router()

  app.post('/api/login', idTokenCheck, asyncHandler(function (req, res) {
    const expiresIn = ms(API_TOKEN_UP_EXPIRES_IN)
    console.log(req.idtoken)
    return tokens.api({ scope: USER_SCOPES }, {
      expiresIn: expiresIn,
      issuer: urls.me(req),
      subject: req.idtoken.sub,
      audience: urls.me(req, '/api')
    })
    .then((apiToken) => {
      res.cookie('api_token', apiToken, {
        expires: new Date(Date.now() + expiresIn),
        httpOnly: !env.isDevelopment,
        secure: !env.isDevelopment
      })

      return {
        code: 200,
        object: {
          expires_in: expiresIn
        }
      }
    })
  }))

  app.post('/api/logout', apiTokenCheck, apiGuard.check('logout'), function (req, res) {
    res.clearCookie('api_token')
    res.clearCookie('stepup_token')
    res.status(200).end()
  })

  return app
}
