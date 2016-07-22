'use strict'

const expressJwtPermissions = require('express-jwt-permissions')

exports.api = function api() {
  return expressJwtPermissions({
    requestProperty: 'user',
    permissionsProperty: 'scope'
  })
}

exports.stepUp = function stepUp () {
  return expressJwtPermissions({
    requestProperty: 'stepup',
    permissionsProperty: 'scope'
  })
}
