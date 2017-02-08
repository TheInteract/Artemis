const UnauthorizedError = require('../errors/unauthorized')
const { split } = require('lodash')
const token = require('./token')
const { wrapper } = require('./wrapper')
const config = require('config')
const url = require('url')
const logger = require('winston')

async function authorized (cookie) {
  if (cookie === undefined) {
    throw new UnauthorizedError()
  }

  const timeStamp = split(cookie, ':', 2)[0]
  // TODO: check token from database
  if (token.generateToken(timeStamp) !== cookie) {
    throw new UnauthorizedError()
  }
  return true
}

async function identify (ic, hostname) {
  if (!ic) {
    throw new UnauthorizedError()
  }

  const clientCollectionName = config.mongo.collectionName.customer
  const client = await this.collection(clientCollectionName).findOne({ ic, hostname })

  if (!client) {
    throw new UnauthorizedError()
  }
  return true
}

async function getUID (uid, ic, hostname) {
  if (!uid || !ic || !hostname) {
    throw new UnauthorizedError()
  }

  const userCollectionName = config.mongo.collectionName.user
  const user = await this.collection(userCollectionName).findOne({ uid, ic, hostname })

  if (!user) {
    return false
  }
  return user
}

async function getCustomer (ic, hostname) {
  if (!ic || !hostname) {
    throw new UnauthorizedError()
  }

  const customerCollectionName = config.mongo.collectionName.customer
  const customer = await this.collection(customerCollectionName).findOne({ ic, hostname })

  if (!customer) {
    return false
  }
  return customer
}

async function getFeatureUniqueCount (ic, hostname, featureList) {
  if (!ic || !hostname || !featureList) {
    throw new UnauthorizedError()
  }

  const userCollectionName = config.mongo.collectionName.user
  for (let feature of featureList) {
    for (let type of feature.types) {
      type.count = await this.collection(userCollectionName).count({ic: ic, hostname: hostname, features: {$elemMatch: {name: feature.name, type: type.typeName}}})
    }
  }
}

async function insertNewUser (uid, ic, hostname, featureList) {
  if (!uid || !ic || !hostname || !featureList) {
    throw new UnauthorizedError()
  }

  var calculatedFeature = []
  for (let feature of featureList) {
    calculatedFeature.push({name: feature.name, type: feature.types[0].typeName})
  }
  const userCollectionName = config.mongo.collectionName.user
  return await this.collection(userCollectionName).insert({uid: uid, ic: ic, hostname: hostname, features: calculatedFeature})
}

async function identifyClient (ctx, next) {
  const hostname = url.parse(ctx.request.origin).hostname
  const { ic } = ctx.request.body
  logger.info('identify client request', { ic, hostname })

  try {
    await wrapper(identify)(ic, hostname)
    logger.info('identify client success', { ic, hostname })
    await next()
  } catch (e) {
    logger.error(`identify client(${ic}) fail`, { message: e.message })
    ctx.throw(e.message, e.status)
  }
}

async function checkPermission (ctx, next) {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)
  // TODO: if browser is disable a cookie, we should provide localStorage and set token with header
  try {
    await authorized(cookie)
    await next()
  } catch (e) {
    ctx.throw(e.message, e.status)
  }
}

module.exports = { authorized, getUID, getCustomer, getFeatureUniqueCount, insertNewUser, identifyClient, checkPermission }
