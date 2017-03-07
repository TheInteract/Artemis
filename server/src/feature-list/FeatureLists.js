import * as FeatureListItem from './FeatureListItem'
import * as Features from '../features/Features'
import * as Version from '../versions/Version'
import * as Versions from '../versions/Versions'

import _ from 'lodash'
// NOTE: FeatureList means a set of versions. For example: [
//   { productId: 'pid-1', userId: 'uid-1', featureId: 'fid-1', name: 'A' },
//   { productId: 'pid-2', userId: 'uid-2', featureId: 'fid-2', name: 'B' },
// ]
export const getFeatureList = async (productId, userId) => {
  const totalFeatures = await Features.getFeaturesByProduct(productId)
  const currentFeatureList = await Versions.getVersions(productId, userId)

  return await Promise.all(_.map(totalFeatures, async feature => {
    const version = _.find(currentFeatureList, version => (
      _.isEqual(version.featureId, feature._id)
    )) || await Version.create(productId, userId, feature)

    return FeatureListItem.create(version)
  }))
}
