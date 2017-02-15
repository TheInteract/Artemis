const UnauthorizedError = require('../errors/unauthorized')
const config = require('config')

async function getUID (uid, cookie, customerCode, hostname) {
  if (!uid || !cookie || !customerCode || !hostname) {
    throw new UnauthorizedError()
  }

  const userCollectionName = config.mongo.collectionName.user
  const user = await this.collection(userCollectionName).findOne({ uid, cookie, customerCode, hostname })

  if (!user) {
    return false
  }
  return user
}

async function getCustomer (customerCode, hostname) {
  if (!customerCode || !hostname) {
    throw new UnauthorizedError()
  }

  const customerCollectionName = config.mongo.collectionName.customer
  const customer = await this.collection(customerCollectionName).findOne({ customerCode, hostname })

  if (!customer) {
    return false
  }
  return customer
}

async function getFeatureUniqueCount (customerCode, hostname, features) {
  if (!customerCode || !hostname || !features) {
    throw new UnauthorizedError()
  }

  const userCollectionName = config.mongo.collectionName.user
  for (let feature of features) {
    for (let version of feature.versions) {
      version.count = await this.collection(userCollectionName).count({customerCode: customerCode, hostname: hostname, features: {$elemMatch: {name: feature.name, version: version.version}}})
    }
  }
}

async function insertNewUser (uid, cookie, customerCode, hostname, featureList) {
  if (!uid || !cookie || !customerCode || !hostname || !featureList) {
    throw new UnauthorizedError()
  }

  var calculatedFeature = []
  for (let feature of featureList) {
    calculatedFeature.push({name: feature.name, version: feature.versions[0].version})
  }
  const userCollectionName = config.mongo.collectionName.user
  return await this.collection(userCollectionName).insert({uid: uid, cookie: cookie, customerCode: customerCode, hostname: hostname, features: calculatedFeature})
}

module.exports = { getUID, getCustomer, getFeatureUniqueCount, insertNewUser }
