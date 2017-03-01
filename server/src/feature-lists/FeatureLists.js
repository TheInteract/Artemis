import * as Collections from '../mongo/Collections'

import { ObjectId } from 'mongodb'
import _ from 'lodash'
import config from 'config'

export const getFeatureList = async (user, product) => {
  const featureListId = _.find(user.featureLists, featureList => {
    return featureList.product === product._id
  })

  try {
    return await Collections.findItem(config.mongo.collections.names.featureList, {
      _id: ObjectId(featureListId)
    }).features
  } catch (e) {
    return []
  }
}
