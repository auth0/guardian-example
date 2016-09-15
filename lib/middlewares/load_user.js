'use strict'

const env = require('../env')
const client = require('guardian-management-client').configure({
  tenant: env['AUTH0_TENANT'],
  region: env['AUTH0_REGION'],
  clientId: env['AUTH0_CLIENT'],
  clientSecret: env['AUTH0_SECRET'],
  domain: env['AUTH0_DOMAIN']
});

module.exports = function (req, res, next) {
  const userId = (req.user).sub
  req.pre.userId = userId
  req.pre.gClient = client; //Put this elsewhere

  const user = client.user.create(userId);

  user.fetch().then(function(user) { 
    req.pre.user = user;
    next(); 
  });
}
