const logger = require('winston')
const { wrapper } = require('../wrapper')
const { updateUser } = require('../mongo-utility')

async function addFeatureToExistingUser (user, customer) {
  let oldFeature = user.features
  let newFeature = customer.features
  let tempFeature = JSON.parse(JSON.stringify(oldFeature))
  let isNewFeature = true
  for (let customerFeature of newFeature) {
    for (let userFeature of oldFeature) {
      if (customerFeature.name === userFeature.name) {
        isNewFeature = false
      }
    }
    if (isNewFeature) {
      tempFeature.push({name: customerFeature.name, version: customerFeature.versions[0].version})
    }
    isNewFeature = true
  }
  if (tempFeature.length !== oldFeature.length) {
    logger.info('Found new feature')
    return await wrapper(updateUser)(user.uid, user.cookie, user.customerCode, user.hostname, tempFeature)
  } else {
    logger.info('No new feature')
    return user
  }
}

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
  return await wrapper(updateUser)(user.uid, user.cookie, user.customerCode, user.hostname, user.features)
}

module.exports = { syncFeatureList }
