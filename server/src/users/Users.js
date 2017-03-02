import config from 'config'
import * as Collections from '../mongo/Collections'

export const createUser = async (hashedUserId, deviceCode) => (
  await Collections.insertItem(config.mongo.collections.names.user, {
    userIdentity: hashedUserId || deviceCode
  })
)

export const getUser = async (hashedUserId, deviceCode) => (
  await Collections.findItem(config.mongo.collections.names.user, {
    userIdentity: hashedUserId || deviceCode
  })
)
