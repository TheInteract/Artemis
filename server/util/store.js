const redis = require('./redisAsync')
const join = require('lodash/join')
const transform = require('lodash/transform')
const logger = require('winston')

async function save (API_KEY, token, data, action) {
  const d = new Date().getTime()
  const hash = transform(data, (result, value, key) => result.push(
    join([ d, action, key ], ':'), value),
    []
  )
  const task = [
    redis().multi()
        .lrem(API_KEY, 0, token)
        .rpush(API_KEY, token)
        .execAsync(),
    redis().hmsetAsync(token, hash),
  ]
  try {
    const result = await Promise.all(task)
    logger.info('save event completed:', { API_KEY, action, token, result })
  } catch (error) {
    logger.error('save event error:', { API_KEY, action, token, error })
  }
}

module.exports = { save }
