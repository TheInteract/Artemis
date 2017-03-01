import config from 'config'
import { wrapper } from './wrapper'
import InvalidArgumentError from '../errors/invalid-argument'

async function getCollectionItem (collectionName, query) {
  return await this.collection(collectionName).findOne(query)
}

async function getUser (uid, cookie, customerCode, hostname) {
  if ((!uid && !cookie) || !customerCode || !hostname) {
    throw new InvalidArgumentError()
  }
  return await wrapper(getCollectionItem)(config.get('mongo.collectionName.user'), { uid, cookie, customerCode, hostname })
}

async function getCustomer (customerCode, hostname) {
  if (!customerCode || !hostname) {
    throw new InvalidArgumentError()
  }

  return await wrapper(getCollectionItem)(config.get('mongo.collectionName.customer'), { customerCode, hostname })
}

async function getFeatureUniqueCount (customerCode, hostname, features) {
  if (!customerCode || !hostname || !features) {
    throw new InvalidArgumentError()
  }

  const userCollectionName = config.get('mongo.collectionName.user')
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

  let calculatedFeature = []
  try {
    for (let feature of featureList) {
      calculatedFeature.push({name: feature.name, version: feature.versions[0].version})
    }
  } catch (e) {
    throw new InvalidArgumentError()
  }
  const userCollectionName = config.get('mongo.collectionName.user')
  const user = await this.collection(userCollectionName).insert({uid: uid, cookie: cookie, customerCode: customerCode, hostname: hostname, features: calculatedFeature})

  return ((user || {}).ops || [])[0]
}

async function updateUser (uid, cookie, customerCode, hostname, featureList) {
  if ((!uid && !cookie) || !customerCode || !hostname || !featureList) {
    throw new InvalidArgumentError()
  }

  const userCollectionName = config.get('mongo.collectionName.user')
  const user = await this.collection(userCollectionName).findOneAndUpdate({uid: uid, cookie: cookie, customerCode: customerCode, hostname: hostname}, {$set: {features: featureList}}, {returnOriginal: false})

  return (user || {}).value
}

module.exports = { getUser, getCustomer, getFeatureUniqueCount: wrapper(getFeatureUniqueCount), insertNewUser: wrapper(insertNewUser), updateUser: wrapper(updateUser) }
