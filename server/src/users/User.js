import * as Collections from '../mongo/Collections'

import config from 'config'

export const create = async (hashedUserId, deviceCode) => (
  await Collections.insertItem(config.mongo.collections.names.user, {
    userIdentity: hashedUserId || deviceCode
  })
)
