const redis = require('redis')
const Promise = require('bluebird')
const config = require('config')
const once = require('lodash/once')

Promise.promisifyAll(redis.RedisClient.prototype)

module.exports = once(() => redis.createClient(config.get('redis.port'), config.get('redis.host')))
