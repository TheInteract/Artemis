import * as Products from './Products'
import UnauthorizedError from '../errors/UnauthorizedError'

import logger from 'winston'

export const authorized = async (ctx, next) => {
  const hostname = ctx.request.ip
  const { API_KEY } = ctx.request.body
  logger.info('Identify context ip: ', ctx.request.ip)

  // TODO: separate API_KEY into 2 sets
  // 1 for module (secret) and 1 for client side
  const product = Products.getProduct(API_KEY, hostname)

  if (!product) {
    const e = new UnauthorizedError()
    logger.error(`failed to identify product(${API_KEY})`, { message: e.message })
    ctx.throw(e.message, e.status)
  } else {
    logger.info('successfully identified product', { API_KEY, hostname })
    await next()
  }
}