import * as Code from '../codes/Code'

import UnauthorizedError from '../errors/UnauthorizedError'
import config from 'config'
import omit from 'lodash/omit'
import store from '../redis/store'

export const checkClientCode = async (ctx, next) => {
  const deviceCodeName = config.get('cookie.device_code')
  const userCodeName = config.get('cookie.user_code')
  const deviceCode = decodeURIComponent(ctx.cookies.get(deviceCodeName))
  const userCode = decodeURIComponent(ctx.cookies.get(userCodeName))
  try {
    Code.authorized(deviceCode)
    if (userCode && (userCode === '' || !Code.validate(userCode))) {
      throw new UnauthorizedError()
    }
  } catch (e) {
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
