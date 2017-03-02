import * as Products from './Products'
import UnauthorizedError from '../errors/UnauthorizedError'

import logger from 'winston'

export const authorized = async (ctx, next) => {
  const hostname = ctx.request.ip
  const { API_KEY_PRIVATE } = ctx.request.body
  logger.info('Identify context ip: ', ctx.request.ip)

  const product = Products.getProductByPrivateKey(API_KEY_PRIVATE, hostname)

  if (!product) {
    const e = new UnauthorizedError()
    logger.error(`failed to identify product(${API_KEY_PRIVATE})`, { message: e.message })
    ctx.throw(e.message, e.status)
  } else {
    logger.info('successfully identified product', { API_KEY_PRIVATE, hostname })
    await next()
  }
}
