import config from 'config'
import * as Collections from '../mongo/Collections'

export const getUser = (hashedUserId, deviceCode) => {
  return Collections.findItem(config.mongo.collections.names.user, {
    hashedUserId,
    deviceCode
  })
}
