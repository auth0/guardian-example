'use strict'

const api2Request = require('../api2_request')

module.exports = function (options) {
  options = options || {}

  return function (req, res, next) {
    const userId = options.userId || req.pre.userId

    api2Request(req.pre.auth0Api2Token, 'GET',
      `/users/${encodeURIComponent(userId)}/enrollments`, null, (err, enrollments) => {
        if (err) { return next(err) }

        req.pre.user = req.pre.user || {}
        req.pre.user.guardian = { enrollments: enrollments }
        next()
      })
  }
}
