import * as Collections from '../mongo/Collections'

import _ from 'lodash'
import config from 'config'

export const getVersionsSortedByCount = async feature => {
  const versionNames = Object.keys(feature.proportion)
  const versionsSortedByCount = _.sortBy(versionNames, async versionName => (
    await Collections.countItems(config.mongo.collections.name.version, {
      featureId: feature._id,
      name: versionName
    })
  ))

  console.log('hello version', versionsSortedByCount)
  return versionsSortedByCount
}

export const getVersions = (productId, userId) => {

}
