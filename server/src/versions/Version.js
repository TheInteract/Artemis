import * as Collections from '../mongo/Collections'
import * as Versions from '../versions/Versions'

import Mongodb from 'mongodb'
import config from 'config'

export const create = async (productId, userId, feature) => {
  const versions = await Versions.getVersionsSortedByCount(feature)
  const version = await Collections.insertItem(config.mongo.collections.names.version, {
    productId: Mongodb.ObjectId(productId),
    userId: Mongodb.ObjectId(userId),
    featureId: Mongodb.ObjectId(feature._id),
    name: versions[0],
  })

  return version
}
