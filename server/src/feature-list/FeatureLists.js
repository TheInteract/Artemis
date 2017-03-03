import * as Features from '../features/Features'
import * as Version from '../versions/Version'
import * as Versions from '../versions/Versions'

import _ from 'lodash'

export const getFeatureList = (product, user) => {
  const totalFeatures = Features.getFeaturesByProduct(product._id)
  const currentList = Versions.getFeatureList(product._id, user._id)

  return _.map(totalFeatures, feature => {
    const version = find(currentList, feature.name)
    return version || Version.create(product._id, user._id, feature._id)
  })
}

const find = (list, featureName) => {
  return _.find(list, feature => feature.name === featureName)
}
