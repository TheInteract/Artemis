import * as Collections from '../mongo/Collections'
import * as User from './User'

import config from 'config'

export const getUser = async (hashedUserId, deviceCode) =>
  await Collections.findItem(config.mongo.collections.names.user, {
    userIdentity: hashedUserId || deviceCode
  }) || await User.create(hashedUserId, deviceCode)
