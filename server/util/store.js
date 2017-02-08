const redis = require('./redisAsync')
const join = require('lodash/join')
const transform = require('lodash/transform')
const logger = require('winston')

async function save (ic, token, data, action) {
  const d = new Date().getTime()
  const hash = transform(data, (result, value, key) => result.push(
    join([ d, action, key ], ':'), value),
    []
  )
  const task = [
    redis().multi()
        .lrem(ic, 0, token)
        .rpush(ic, token)
        .execAsync(),
    redis().hmsetAsync(token, hash),
  ]
  try {
    const result = await Promise.all(task)
    logger.info('save event completed:', { ic, action, token, result })
  } catch (error) {
    logger.error('save event error:', { ic, action, token, error })
  }
}

module.exports = { save }
