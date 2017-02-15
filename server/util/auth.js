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

async function identify (customerCode, hostname) {
  if (!customerCode) {
    throw new UnauthorizedError()
  }

  const clientCollectionName = config.mongo.collectionName.customer
  const client = await this.collection(clientCollectionName).findOne({ customerCode, hostname })
  if (!client) {
    throw new UnauthorizedError()
  }
  return true
}

async function identifyCustomer (ctx, next) {
  const hostname = url.parse(ctx.request.origin).hostname
  const { customerCode } = ctx.request.body
  try {
    await wrapper(identify)(customerCode, hostname)
    logger.info('identify client success', { customerCode, hostname })
  } catch (e) {
    logger.error(`identify client(${customerCode}) fail`, { message: e.message })
    ctx.throw(e.message, e.status)
  }
  next()
}

async function checkCookie (ctx, next) {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)
  console.log(cookie)
  // TODO: if browser is disable a cookie, we should provide localStorage and set token with header
  try {
    await authorized(cookie)
  } catch (e) {
    ctx.throw(e.message, e.status)
  }
  next()
}

module.exports = { authorized, identifyCustomer, checkCookie }
