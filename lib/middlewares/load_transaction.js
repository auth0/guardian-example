'use strict'

module.exports = function (options) {
  return function (req, res, next) {
    req.pre.transaction = req.session[req.headers['x-transaction-id']]

    if (options.delete) {
      delete req.session[req.headers['x-transaction-id']]
    }

    next()
  }
}
