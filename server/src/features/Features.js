import * as Collections from '../mongo/Collections'

import Mongodb from 'mongodb'
import config from 'config'

export const getFeaturesByProduct = async (productId) => {
  return await Collections.findItems(config.mongo.collections.names.feature, {
    productId: Mongodb.ObjectId(productId)
  })
}
