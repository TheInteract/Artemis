import * as Collections from '../mongo/Collections'

import Mongodb from 'mongodb'
import config from 'config'

export const createFeatureList = () => {

}

export const getFeatureList = async (featureListId) => {
  return await Collections.findItem(config.mongo.collections.names.featureList, {
    _id: Mongodb.ObjectId(featureListId)
  })
}

export const syncFeafeatureList = () => {

}
