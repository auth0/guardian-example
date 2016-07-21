'use strict'

const environment = process.env['NODE_ENV'] || 'development'
const fileConfig = require('../config/config')
let envFileConfig;

try {
  envFileConfig = require(`../config/config.${environment}.js`)
} catch (e) {
  console.error(e)
}

const config = Object.assign({}, fileConfig, envFileConfig, process.env)

config.isDevelopment = config['NODE_ENV'] !== 'production'

module.exports = config
