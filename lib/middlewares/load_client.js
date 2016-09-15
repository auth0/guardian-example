'use strict'

const env = require('../env')

module.exports = function (req, res, next) {
  const client = require('guardian-management-client').configure({
    tenant: env['AUTH0_TENANT'],
    region: env['AUTH0_REGION'],
    clientId: env['AUTH0_CLIENT'],
    clientSecret: env['AUTH0_SECRET'],
    domain: env['AUTH0_DOMAIN']
  });

  req.pre.gClient = client; 

  next();
}
