'use strict'

const jwt = require('express-jwt')

module.exports = function(options) {
  const mw = jwt(options);

  return function(req, res, next) {
    return mw(req, res, function(err) {
      if (err && err.name === 'UnauthorizedError') {
        return options.onUnauthorized(null, next)
      }

      return next(err)
    })
  }
};
