import redis from './redisAsync'
import logger from 'winston'

export default async (deviceCode, userCode, data, action) => {
  let objectToBePublished = {}
  data.issueTime = new Date().getTime()
  objectToBePublished.data = data
  objectToBePublished.deviceCode = deviceCode
  objectToBePublished.userCode = userCode || null
  objectToBePublished.action = action
  const task = [
    redis().multi()
        .publish(action, JSON.stringify(objectToBePublished))
        .execAsync()
  ]
  try {
    const result = await Promise.all(task)
    logger.info('save event completed:', { deviceCode, action, result })
  } catch (error) {
    logger.error('save event error:', { deviceCode, action, error })
  }
}
