import * as Collections from '../mongo/Collections'

import Mongodb from 'mongodb'
import _ from 'lodash'
import config from 'config'

export const getFeatures = async (user, product) => {
  const { featureListId } = _.find(user.featureLists, featureList => {
    return featureList.productId === product._id
  })

  try {
    return await Collections.findItem(config.mongo.collections.names.featureList, {
      _id: Mongodb.ObjectId(featureListId)
    }).features
  } catch (e) {
    return []
  }
}
