import * as Collections from '../mongo/Collections'

import _ from 'lodash'
import config from 'config'

export const getVersionsSortedByCount = async feature => {
  const versionNames = Object.keys(feature.proportion)

  const versions = await Promise.all(_.map(versionNames, async versionName => ({
    name: versionName,
    count: await Collections.countItems(config.mongo.collections.names.version, {
      featureId: feature._id,
      name: versionName
    })
  })))

  return _.flow(
    versions => _.sortBy(versions, 'count'),
    versions => _.map(versions, 'name')
  )(versions)
}

export const getVersions = async (productId, userId) => {
  return await Collections.findItems(config.mongo.collections.names.version, {
    productId: productId,
    userId: userId,
  })
}

export const getVerionIds = async (productId, userId) => {
  const versions = await getVersions(productId, userId)
  return _.map(versions, version => version._id)
}
