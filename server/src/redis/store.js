import redis from './redisAsync'
import logger from 'winston'

export default async (deviceCode, userCode, data, action) => {
  const d = new Date().getTime()
  data.issueTime = d
  const task = [
    redis().multi()
        .publish(action, JSON.stringify(data))
        .execAsync()
  ]
  try {
    const result = await Promise.all(task)
    logger.info('save event completed:', { deviceCode, action, result })
  } catch (error) {
    logger.error('save event error:', { deviceCode, action, error })
  }
}
