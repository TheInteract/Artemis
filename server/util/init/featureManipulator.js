const logger = require('winston')
const { updateUser } = require('../mongoUtility')

async function syncFeatureList (user, customer) {
  let isUseOld = false
  let isNewFeature = false
  let currentFeatureList = user.features
  const newFeatureList = customer.features
  let tempCurrentFeatureList = []
  for (let feature of newFeatureList) {
    tempCurrentFeatureList.push({name: feature.name, version: feature.versions[0].version})
  }
  for (let newFeature of tempCurrentFeatureList) {
    for (let oldFeature of currentFeatureList) {
      if (oldFeature.name === newFeature.name) {
        newFeature.version = oldFeature.version
        isUseOld = true
      }
    }
    if (!isUseOld) {
      isNewFeature = true
    }
    isUseOld = false
  }
  if (isNewFeature || tempCurrentFeatureList.length !== currentFeatureList.length) {
    logger.info('Found new feature and synced')
  } else {
    logger.info('No new feature found, no sync')
  }
  user.features = tempCurrentFeatureList
  return await updateUser(user.uid, user.cookie, user.API_KEY, user.hostname, user.features)
}

module.exports = { syncFeatureList }
