const InvalidArgumentError = require('../errors/invalid-argument')
const config = require('config')

async function getUID (uid, cookie, customerCode, hostname) {
  if ((!uid && !cookie) || !customerCode || !hostname) {
    throw new InvalidArgumentError()
  }

  const userCollectionName = config.mongo.collectionName.user
  const user = await this.collection(userCollectionName).findOne({ uid, cookie, customerCode, hostname })

  if (!user) {
    return undefined
  }
  return user
}

async function getCustomer (customerCode, hostname) {
  if (!customerCode || !hostname) {
    throw new InvalidArgumentError()
  }

  const customerCollectionName = config.mongo.collectionName.customer
  const customer = await this.collection(customerCollectionName).findOne({ customerCode, hostname })

  if (!customer) {
    return undefined
  }
  return customer
}

async function getFeatureUniqueCount (customerCode, hostname, features) {
  if (!customerCode || !hostname || !features) {
    throw new InvalidArgumentError()
  }

  const userCollectionName = config.mongo.collectionName.user
  try {
    for (let feature of features) {
      for (let version of feature.versions) {
        version.count = await this.collection(userCollectionName).count({customerCode: customerCode, hostname: hostname, features: {$elemMatch: {name: feature.name, version: version.version}}})
      }
    }
  } catch (e) {
    throw new InvalidArgumentError()
  }
}

async function insertNewUser (uid, cookie, customerCode, hostname, featureList) {
  if ((!uid && !cookie) || !customerCode || !hostname || !featureList) {
    throw new InvalidArgumentError()
  }

  var calculatedFeature = []
  try {
    for (let feature of featureList) {
      calculatedFeature.push({name: feature.name, version: feature.versions[0].version})
    }
  } catch (e) {
    throw new InvalidArgumentError()
  }
  const userCollectionName = config.mongo.collectionName.user
  const user = await this.collection(userCollectionName).insert({uid: uid, cookie: cookie, customerCode: customerCode, hostname: hostname, features: calculatedFeature})

  if (!user) {
    return undefined
  }
  return user
}

module.exports = { getUID, getCustomer, getFeatureUniqueCount, insertNewUser }
