'use strict'

module.exports = function (options) {
  options = options || {}

  return function (req, res, next) {
    req.pre.user.getEnrollments().then(function(enrollments) { 
      req.pre.user = req.pre.user || {}
      req.pre.user.set("guardian", { enrollments: enrollments });
      next();
   });
  }
}
