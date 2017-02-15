const UnauthorizedError = require('../errors/unauthorized')
const config = require('config')

async function getUID (uid, customerCode, hostname) {
  if (!uid || !customerCode || !hostname) {
    throw new UnauthorizedError()
  }

  const userCollectionName = config.mongo.collectionName.user
  const user = await this.collection(userCollectionName).findOne({ uid, customerCode, hostname })

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

async function getFeatureUniqueCount (customerCode, hostname, featureList) {
  if (!customerCode || !hostname || !featureList) {
    throw new UnauthorizedError()
  }

  const userCollectionName = config.mongo.collectionName.user
  for (let feature of featureList) {
    for (let type of feature.types) {
      type.count = await this.collection(userCollectionName).count({customerCode: customerCode, hostname: hostname, features: {$elemMatch: {name: feature.name, type: type.typeName}}})
    }
  }
}

async function insertNewUser (uid, customerCode, hostname, featureList) {
  if (!uid || !customerCode || !hostname || !featureList) {
    throw new UnauthorizedError()
  }

  var calculatedFeature = []
  for (let feature of featureList) {
    calculatedFeature.push({name: feature.name, type: feature.types[0].typeName})
  }
  const userCollectionName = config.mongo.collectionName.user
  return await this.collection(userCollectionName).insert({uid: uid, customerCode: customerCode, hostname: hostname, features: calculatedFeature})
}

module.exports = { getUID, getCustomer, getFeatureUniqueCount, insertNewUser }
