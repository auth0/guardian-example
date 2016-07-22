const express = require('express')
const asyncHandler = require('../lib/async_handler')
const loadUser = require('../lib/middlewares/load_user')
const loadUserEnrollments = require('../lib/middlewares/load_user_enrollments')
const tokenChecker = require('../lib/middlewares/token_checker')
const authorization = require('../lib/middlewares/authorization')

const apiTokenCheck = tokenChecker.api()
const apiGuard = authorization.api()

module.exports = function () {
  const app = express.Router()

  app.get('/api/users/me',
    apiTokenCheck,
    apiGuard.check('read:current_user'),
    loadUser,
    loadUserEnrollments(),
    asyncHandler(function (req, res) {
      return {
        code: 200,
        object: req.pre.user
      }
    }))

  return app
}
