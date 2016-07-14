'use strict'

module.exports = function (options) {
  return function fromHeaderOrCookie (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies[options.property]) {
      return req.cookies[options.property]
    }

    return null
  }
}
