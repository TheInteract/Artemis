const redis = require('./redisAsync')
const join = require('lodash/join')
const transform = require('lodash/transform')
const logger = require('winston')

async function save(uid, token, data, action) {
    const d = new Date().getTime()
    const hash = transform(data, (result, value, key) => result.push(join([d, key], ':'), value), [])
    const task = [
        redis().hmsetAsync(uid, token, join([d, action], ':')),
        redis().hmsetAsync(token, hash),
    ]
    try {
        const result = await Promise.all(task)
        logger.info('save event completed:', { uid, action, token, result })
    } catch (error) {
        logger.error('save event error:', { uid, action, token, error })
    }
}

module.exports = { save }
