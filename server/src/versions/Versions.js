import * as Collections from '../mongo/Collections'

import _ from 'lodash'
import config from 'config'

export const getVersionsSortedByCount = async feature => {
  const versionNames = Object.keys(feature.proportion)
  let allCount = 0
  let versions = await Promise.all(_.map(versionNames, async versionName => ({
    name: versionName,
    proportion: feature.proportion[versionName],
    count: await Collections.countItems(config.mongo.collections.names.version, {
      featureId: feature._id,
      name: versionName
    })
  })))

  _.forEach(versions, function (version) {
    allCount += version.count
  })

  if (allCount > 0) {
    versions = await Promise.all(_.map(versions, async version => ({
      name: version.name,
      proportion: version.proportion,
      count: version.count,
      proportionDifference: ((version.count / allCount) * 100) - version.proportion
    })))
    versions = _.flow(
      versions => _.sortBy(versions, 'proportionDifference'),
      versions => _.map(versions, 'name')
    )(versions)
  } else {
    versions = _.flow(
      versions => _.sortBy(versions, 'count'),
      versions => _.map(versions, 'name')
    )(versions)
  }

  return versions
}

export const getVersions = async (productId, userId) => {
  return await Collections.findItems(config.mongo.collections.names.version, {
    productId: productId,
    userId: userId,
  })
}

export const getVerionIds = async (productId, userId) => {
  const versions = await getVersions(productId, userId)
  return _.map(versions, version => ({ versionId: version._id, featureId: version.featureId, name: version.name }))
}
