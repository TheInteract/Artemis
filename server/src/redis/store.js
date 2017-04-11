import logger from 'winston'
import redis from './redisAsync'

export default async (API_KEY_PUBLIC, versions, deviceCode, userCode, data, type) => {
  let objectToBePublished = {}
  objectToBePublished.issueTime = new Date().getTime()
  objectToBePublished.type = type
  objectToBePublished.API_KEY_PUBLIC = API_KEY_PUBLIC
  objectToBePublished.versions = JSON.parse(versions)
  objectToBePublished.deviceCode = deviceCode
  objectToBePublished.userCode = userCode || null
  objectToBePublished.action = data

  const task = [
    redis().multi()
        .publish(type, JSON.stringify(objectToBePublished))
        .execAsync()
  ]
  try {
    const result = await Promise.all(task)
    logger.info('save event completed:', { deviceCode, type, result })
  } catch (error) {
    logger.error('save event error:', { deviceCode, type, error })
  }
}
