import * as Collections from '../mongo/Collections'

import Mongodb from 'mongodb'
import config from 'config'

export const createVersion = async (productId, userId, featureId) => {
  return await Collections.insertItem(config.mongo.collections.names.version, {
    productId: Mongodb.ObjectId(productId),
    userId: Mongodb.ObjectId(userId),
    featureId: Mongodb.ObjectId(featureId),
    name: 0
  })
}

export const countVersions = async (featureId, name) => {
  return await Collections.countItems(config.mongo.collections.names.version, {
    featureId: Mongodb.ObjectId(featureId),
    name: name
  })
}

export const getFeatureList = (productId, userId) => {

}
