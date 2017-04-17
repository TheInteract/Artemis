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

  versions = await Promise.all(_.map(versions, async version => ({
    name: version.name,
    proportion: version.proportion,
    count: version.count,
    proportionDifference: ((version.count / allCount) * 100) - version.proportion
  })))

  return _.flow(
    versions => _.sortBy(versions, 'proportionDifference'),
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
