const token = require('./token')
const config = require('config')
const logger = require('winston')
const { split } = require('lodash')
const { getCustomer } = require('./mongoUtility')
const UnauthorizedError = require('../errors/unauthorized')
const InvalidArgumentError = require('../errors/invalid-argument')

async function authorized (cookie) {
  if (cookie === undefined) {
    throw new InvalidArgumentError()
  }

  const timeStamp = split(cookie, ':', 2)[0]
  // TODO: check token from database
  if (token.generateToken(timeStamp) !== cookie) {
    throw new UnauthorizedError()
  }
  return true
}

async function hashAuthorized (cookie) {
  if (cookie === undefined) {
    throw new InvalidArgumentError()
  }

  const hash = split(cookie, ':', 2)[0]
  // TODO: check token from database
  if (token.generateHashToken(hash) !== cookie) {
    throw new UnauthorizedError()
  }
  return true
}

async function identifyCustomer (ctx, next) {
  const hostname = ctx.request.ip
  const { customerCode } = ctx.request.body
  logger.info('Identify context ip: ', ctx.request.ip)
  try {
    await getCustomer(customerCode, hostname)
    logger.info('identify client success', { customerCode, hostname })
  } catch (e) {
    logger.error(`identify client(${customerCode}) fail`, { message: e.message })
    ctx.throw(e.message, e.status)
  }
  await next()
}

async function checkCookie (ctx, next) {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)
  // TODO: if browser is disable a cookie, we should provide localStorage and set token with header
  try {
    await authorized(cookie)
  } catch (e) {
    ctx.throw(e.message, e.status)
  }
  await next()
}

module.exports = { authorized, hashAuthorized, identifyCustomer, checkCookie }
