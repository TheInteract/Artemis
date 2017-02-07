const url = require('url')
const config = require('config')

const basePath = config.get('base')

require('babel-register')
// Client Side is not support
global.rootRequire = (name) => {
  const dir = url.join(__dirname, basePath, name)
  return require(dir)
}

require('./util/log.js')
require('./server.js')