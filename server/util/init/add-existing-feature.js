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

module.exports = { addFeatureToExistingUser }
