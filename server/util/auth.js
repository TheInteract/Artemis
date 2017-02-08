const UnauthorizedError = require('../errors/unauthorized')
const { split } = require('lodash')
const token = require('./token')
const { wrapper } = require('./wrapper')
const config = require('config')

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

async function identify (uid, hostname) {
  if (!uid) {
    throw new UnauthorizedError()
  }

  const clientCollectionName = config.mongo.collectionName.user
  const client = await this.collection(clientCollectionName).findOne({ uid, hostname })

  if (!client) {
    throw new UnauthorizedError()
  }
  return true
}

module.exports = { authorized, identify: wrapper(identify) }
