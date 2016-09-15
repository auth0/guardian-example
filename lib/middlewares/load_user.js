'use strict'

const env = require('../env')

module.exports = function (req, res, next) {
  const userId = (req.user).sub
  req.pre.userId = userId

  const user = req.pre.gClient.user.create(userId);

  user.fetch().then(function(user) { 
    req.pre.user = user;
    next(); 
  });
}
