import redis from 'redis'
import Promise from 'bluebird'
import config from 'config'
import once from 'lodash/once'

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

export default once(() => redis.createClient(
  config.get('redis.port'),
  config.get('redis.host')
))
