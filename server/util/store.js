const redis = require('./redisAsync')
const join = require('lodash/join')
const transform = require('lodash/transform')
const logger = require('winston')

async function save (customerCode, token, data, action) {
  const d = new Date().getTime()
  const hash = transform(data, (result, value, key) => result.push(
    join([ d, action, key ], ':'), value),
    []
  )
  const task = [
    redis().multi()
        .lrem(customerCode, 0, token)
        .rpush(customerCode, token)
        .execAsync(),
    redis().hmsetAsync(token, hash),
  ]
  try {
    const result = await Promise.all(task)
    logger.info('save event completed:', { customerCode, action, token, result })
  } catch (error) {
    logger.error('save event error:', { customerCode, action, token, error })
  }
}

module.exports = { save }
