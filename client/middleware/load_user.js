'use strict'

const api2Request = require('../api2_request')

module.exports = function (req, res, next) {
  const userId = (req.user || req.stepup_idtoken).sub
  req.pre.userId = userId

  api2Request(req.pre.auth0Api2Token, 'GET', `/users/${encodeURIComponent(userId)}`, null, (err, user) => {
    if (err) { return next(err) }
    req.pre.user = user

    next()
  })
}
