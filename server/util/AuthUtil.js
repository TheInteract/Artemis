import * as MongoUtil from './MongoUtil'

import config from 'config'
import logger from 'winston'

export async function identifyCustomer (ctx, next) {
  const hostname = ctx.request.ip
  const { API_KEY } = ctx.request.body
  logger.info('Identify context ip: ', ctx.request.ip)
  try {
    await MongoUtil.getCustomer(API_KEY, hostname)
    logger.info('identify client success', { API_KEY, hostname })
  } catch (e) {
    logger.error(`identify client(${API_KEY}) fail`, { message: e.message })
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
