const url = require('url')
const config = require('config')

const basePath = config.get('base')
global.__basename = url.join(__dirname, basePath)
global.__base = basePath

require('babel-register')
require('./src/util/log.js')
require('./src/server/index.js')
