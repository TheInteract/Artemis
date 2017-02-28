import * as CookieUtil from './CookieUtil'
import * as MongoUtil from './MongoUtil'

import InvalidArgumentError from '../errors/invalid-argument'
import UnauthorizedError from '../errors/unauthorized'
import config from 'config'
import logger from 'winston'
import { split } from 'lodash'

export const authorized = code => {
  if (!code) throw new InvalidArgumentError()

  const key = split(code, ':', 2)[0]
  // TODO: check CookieUtil from database
  if (!CookieUtil.validate(key, code)) throw new UnauthorizedError()
  return true
}

export const validateCode = code => {
  const key = split(code, ':', 2)[0]
  const result = CookieUtil.validate(key, code)

  if (result) {
    logger.info('device code is valid:', { code })
  } else {
    logger.warn('device code is invalid', { code })
  }

  return result
}

export async function identifyCustomer (ctx, next) {
  const hostname = ctx.request.ip
  const { customerCode } = ctx.request.body
  logger.info('Identify context ip: ', ctx.request.ip)
  try {
    await MongoUtil.getCustomer(customerCode, hostname)
    logger.info('identify client success', { customerCode, hostname })
  } catch (e) {
    logger.error(`identify client(${customerCode}) fail`, { message: e.message })
    ctx.throw(e.message, e.status)
  }
  await next()
}

export async function checkCookie (ctx, next) {
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
