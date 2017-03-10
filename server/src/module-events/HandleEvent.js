import config from 'config'
import * as Code from '../codes/Code'
import UnauthorizedError from '../errors/UnauthorizedError'
import store from '../redis/store'

export const checkClientCode = async (ctx, next) => {
  const deviceCodeName = config.get('cookie.device_code')
  const userCodeName = config.get('cookie.user_code')
  const deviceCode = ctx.cookies.get(deviceCodeName)
  const userCode = ctx.cookies.get(userCodeName)

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
  const action = ctx.params.type
  const { body } = ctx.request
  const deviceCodeName = config.get('cookie.device_code')
  const userCodeName = config.get('cookie.user_code')
  const deviceCode = ctx.cookies.get(deviceCodeName)
  const userCode = ctx.cookies.get(userCodeName)
  // An error should not throw to client side.
  try {
    await store(deviceCode, userCode, body, action)
    if (!ctx.body) {
      ctx.body = {}
    }
    ctx.status = 200
  } catch (e) {
    ctx.throw(e.message, e.status)
  }
}
