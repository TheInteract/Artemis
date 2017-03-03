import * as Collections from '../mongo/Collections'

import config from 'config'

export const create = async (productId, userId, featureId) => {
  return await Collections.insertItem(config.mongo.collections.names.version, {
    productId: productId,
    userId: userId,
    featureId: featureId,
    name: 0
  })
}
