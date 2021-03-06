const express = require('express')
const gmc = require('guardian-management-client')
const asyncHandler = require('../lib/async_handler')
const env = require('../lib/env')
const loadUser = require('../lib/middlewares/load_user')
const loadUserEnrollments = require('../lib/middlewares/load_user_enrollments')
const Boom = require('boom')
const api2request = require('../lib/api2_request')
const tokenChecker = require('../lib/middlewares/token_checker')
const authorization = require('../lib/middlewares/authorization')

const apiTokenCheck = tokenChecker.api()
const stepUpTokenCheck = tokenChecker.stepUp()
const stepUpGuard = authorization.stepUp()

module.exports = function () {
  const app = express.Router()

  app.use('/api/users/me/mfa',
    apiTokenCheck, stepUpTokenCheck,
    loadUser, loadUserEnrollments(),
    loadGuardianClient)

  app.delete('/api/users/me/mfa/enrollments/:id',
    stepUpGuard.check('update:mfa_settings'),
    loadEnrollment,
    checkUserOwnerForEnrollment,
    asyncHandler(function (req) {
      return req.pre.enrollment.del().return({ code: 204, object: {} })
    }))

  app.patch('/api/users/me/mfa',
    stepUpGuard.check('update:mfa_settings'),
    function (req, res, next) {
      const payload = { use_mfa: req.body.use_mfa }

      return api2request(req.pre.auth0Api2Token, 'PATCH', `users/${encodeURIComponent(req.pre.userId)}`, {
        user_metadata: payload
      }, (err) => {
        if (err) { return next(err) }

        res.status(200).send(payload)
      })
    })

  app.post('/api/users/me/mfa/regenerate-recovery-code',
    stepUpGuard.check('update:mfa_settings'),
    function postRegenerateRecoveryCode(req, res, next) {
      api2request(
        req.pre.auth0Api2Token, 'POST',
        `/users/${encodeURIComponent(req.pre.userId)}/recovery-code-regeneration`, {},
        (err, response) => {
          if (err) next(err)
          else res.status(200).send(response)
        }
      )
    })


  return app
}

function loadGuardianClient (req, res, next) {
  req.pre.gClient = gmc.configure({
    client: {
      token: req.pre.auth0Api2Token,
      region: env['AUTH0_REGION'],
      tenant: env['AUTH0_TENANT']
    }
  })

  next()
}

function loadEnrollment (req, res, next) {
  req.pre.gClient.enrollment.create(req.params.id)
    .fetch()
    .then((e) => { req.pre.enrollment = e })
    .asCallback(next)
}

function checkUserOwnerForEnrollment (req, res, next) {
  if (!req.pre.user.guardian.enrollments.find((e) => e.id === req.params.id)) {
    return next(Boom.notFound())
  }

  return next()
}
