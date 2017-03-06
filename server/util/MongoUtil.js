import config from 'config'
import wrapper from '../src/mongo/withMongodb'
import InvalidArgumentError from '../src/errors/InvalidArgumentError'

async function getCollectionItem (collectionName, query) {
  return await this.collection(collectionName).findOne(query)
}

async function getUser (uid, cookie, API_KEY, hostname) {
  if ((!uid && !cookie) || !API_KEY || !hostname) {
    throw new InvalidArgumentError()
  }
  return await wrapper(getCollectionItem)(config.get('mongo.collectionName.user'), { uid, cookie, API_KEY, hostname })
}

async function getCustomer (API_KEY, hostname) {
  if (!API_KEY || !hostname) {
    throw new InvalidArgumentError()
  }

  return await wrapper(getCollectionItem)(config.get('mongo.collectionName.customer'), { API_KEY, hostname })
}

async function getFeatureUniqueCount (API_KEY, hostname, features) {
  if (!API_KEY || !hostname || !features) {
    throw new InvalidArgumentError()
  }

  const userCollectionName = config.get('mongo.collectionName.user')
  try {
    for (let feature of features) {
      for (let version of feature.versions) {
        version.count = await this.collection(userCollectionName).count({API_KEY: API_KEY, hostname: hostname, features: {$elemMatch: {name: feature.name, version: version.version}}})
      }
    }
  } catch (e) {
    throw new InvalidArgumentError()
  }
}

async function insertNewUser (uid, cookie, API_KEY, hostname, featureList) {
  if ((!uid && !cookie) || !API_KEY || !hostname || !featureList) {
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
  const user = await this.collection(userCollectionName).insert({uid: uid, cookie: cookie, API_KEY: API_KEY, hostname: hostname, features: calculatedFeature})

  return ((user || {}).ops || [])[0]
}

async function updateUser (uid, cookie, API_KEY, hostname, featureList) {
  if ((!uid && !cookie) || !API_KEY || !hostname || !featureList) {
    throw new InvalidArgumentError()
  }

  const userCollectionName = config.get('mongo.collectionName.user')
  const user = await this.collection(userCollectionName).findOneAndUpdate({uid: uid, cookie: cookie, API_KEY: API_KEY, hostname: hostname}, {$set: {features: featureList}}, {returnOriginal: false})

  return (user || {}).value
}

module.exports = { getUser, getCustomer, getFeatureUniqueCount: wrapper(getFeatureUniqueCount), insertNewUser: wrapper(insertNewUser), updateUser: wrapper(updateUser) }
