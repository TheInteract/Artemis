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

async function identifyClient (ctx, next) {
  const hostname = url.parse(ctx.request.origin).hostname
  const { uid } = ctx.request.body
  logger.info('identify client request', { uid, hostname })

  try {
    await wrapper(identify)(uid, hostname)
    logger.info('identify client success', { uid, hostname })
    await next()
  } catch (e) {
    logger.error(`identify client(${uid}) fail`, { message: e.message })
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

module.exports = { identifyClient, checkPermission }
