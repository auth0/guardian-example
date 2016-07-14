'use strict'

const environment = process.env['NODE_ENV'] || 'development'
const fileConfig = require('../config/config')
const envFileConfig = require(`../config/config.${environment}`)

const config = Object.assign({}, fileConfig, envFileConfig, process.env)

config.isDevelopment = config['NODE_ENV'] !== 'production'

module.exports = config
