'use strict'

const Promise = require('bluebird')

module.exports = function asyncHandlerBuilder (handler) {
  return function asyncHandler (req, res, next) {
    let promise

    try {
      promise = Promise.resolve(handler(req, res))
    } catch (e) {
      next(e)
    }

    return promise
      .then((r) => {
        if (r.object) {
          res.status(r.code || 200).json(r.object)
          return
        }

        res.status(200).json(r)
      })
      .catch(next)
  }
}
