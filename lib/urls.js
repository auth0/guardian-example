'use strict'

const urlJoin = require('url-join')

exports.me = function me(req, path) {
  const protocol = req.connection.encrypted ? 'https' : 'http';

  return urlJoin(`${protocol}://${req.headers.host}`, path);
}
