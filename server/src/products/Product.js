import * as Products from './Products'

import UnauthorizedError from '../errors/UnauthorizedError'
import logger from 'winston'
import url from 'url'

// TODO: make authorized receive necessary params
// some other function should handle ctx and next instead of this function
export const authorized = async (ctx, next) => {
  const { API_KEY_PRIVATE } = ctx.request.body

  const product = await Products.getProductByPrivateKey(API_KEY_PRIVATE)

  if (!product) {
    const e = new UnauthorizedError()
    logger.error(`failed to identify product(${API_KEY_PRIVATE})`, { message: e.message })
    ctx.throw(e.message, e.status)
  } else {
    logger.info('successfully identified product', { API_KEY_PRIVATE })
    await next()
  }
}

export const clientAuthorization = async (ctx, next) => {
  const domainName = url.parse(ctx.request.headers.origin).hostname
  const { API_KEY_PUBLIC } = ctx.request.body
  logger.info('client: Identify domain name: ', domainName)

  const product = await Products.getProductByPublicKey(API_KEY_PUBLIC, domainName)

  if (!product) {
    const e = new UnauthorizedError()
    logger.error(`client: failed to identify product(${API_KEY_PUBLIC})`, { message: e.message })
    ctx.throw(e.message, e.status)
  } else {
    logger.info('client: successfully identified product', { API_KEY_PUBLIC, domainName })
    await next()
  }
}
