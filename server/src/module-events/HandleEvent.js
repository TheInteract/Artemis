import * as Code from '../codes/Code'

import UnauthorizedError from '../errors/UnauthorizedError'
import logger from 'winston'
import omit from 'lodash/omit'
import querystring from 'querystring'
import store from '../redis/store'

export const checkClientCode = async (ctx, next) => {
  const deviceCode = querystring.unescape(ctx.headers['device-code'])
  var userCode = querystring.unescape(ctx.headers['user-code'])

  logger.info('client: validation deviceCode and userCode: ', { deviceCode, userCode })

  try {
    Code.authorized(deviceCode)
    if (userCode !== 'undefined') {
      if (userCode === '' || !Code.validate(userCode)) {
        throw new UnauthorizedError('userCode')
      }
    }
  } catch (e) {
    logger.error(`client: failed to valid deviceCode or userCode`, { message: e.message, deviceCode, userCode })
    ctx.throw(e.message, e.status)
  }
  await next()
}

export const sendToRedis = async ctx => {
  let { body } = ctx.request
  const { API_KEY_PUBLIC, versions } = body
  body = omit(body, [ 'API_KEY_PUBLIC', 'versions' ])
  const deviceCode = querystring.unescape(ctx.headers['device-code'])
  var userCode = querystring.unescape(ctx.headers['user-code'])
  const action = ctx.params.type

  if (userCode === 'undefined') {
    userCode = undefined
  }
  try {
    await store(API_KEY_PUBLIC, versions, deviceCode, userCode, body, action)
    if (!ctx.body) {
      ctx.body = {}
    }
    ctx.status = 200
  } catch (e) {
    ctx.throw(e.message, e.status)
  }
}
