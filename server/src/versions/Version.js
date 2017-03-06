import * as Collections from '../mongo/Collections'
import * as Versions from '../versions/Versions'

import config from 'config'

export const create = async (productId, userId, feature) => {
  return await Collections.insertItem(config.mongo.collections.names.version, {
    productId: productId,
    userId: userId,
    featureId: feature._id,
    name: Versions.getVersionsSortedByCount(feature)[0],
  })
}
