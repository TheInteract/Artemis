import * as Code from '../codes/Code'

import UnauthorizedError from '../errors/UnauthorizedError'
import config from 'config'
import logger from 'winston'
import omit from 'lodash/omit'
import querystring from 'querystring'
import store from '../redis/store'

export const checkClientCode = async (ctx, next) => {
  const deviceCodeName = config.get('cookie.device_code')
  const userCodeName = config.get('cookie.user_code')
  const deviceCode = querystring.unescape(ctx.cookies.get(deviceCodeName))
  const userCode = querystring.unescape(ctx.cookies.get(userCodeName))

  logger.info('client: validation deviceCode and userCode: ', { deviceCode, userCode })

  try {
    Code.authorized(deviceCode)
    if (userCode && (userCode === '' || !Code.validate(userCode))) {
      throw new UnauthorizedError('userCode')
    }
  } catch (e) {
    logger.error(`client: failed to valid deviceCode or userCode`, { message: e.message, deviceCode, userCode })
    ctx.throw(e.message, e.status)
  }
  await next()
}

export const sendToRedis = async ctx => {
  let { body } = ctx.request
  const { API_KEY_PUBLIC } = body
  body = omit(body, 'API_KEY_PUBLIC')
  const deviceCodeName = config.get('cookie.device_code')
  const userCodeName = config.get('cookie.user_code')
  const deviceCode = ctx.cookies.get(deviceCodeName)
  const userCode = ctx.cookies.get(userCodeName)
  const action = ctx.params.type

  try {
    await store(API_KEY_PUBLIC, deviceCode, userCode, body, action)
    if (!ctx.body) {
      ctx.body = {}
    }
    ctx.status = 200
  } catch (e) {
    ctx.throw(e.message, e.status)
  }
}
