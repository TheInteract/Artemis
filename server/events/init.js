import * as Cookie from '../src/cookie/Cookie'
import * as Authentication from '../src/user/Authentication'

import logger from 'winston'

export default async function init (ctx) {
  const { API_KEY_PRIVATE, ...body } = ctx.request.body
  const { deviceCode, hashedUserId } = body.userIdentity || {}
  const ip = ctx.request.ip

  // const cookie = hashedUserId
  //   ? await setupUserCookie(hashedUserId, deviceCode)
  //     : await setupCookie(deviceCode)

  // const responseString = 'console.log(\'Hello I\\\'m interact\')'
  //
  // let user
  //
  // try {
  //   user = await handleUserOnInit(hashedUserId, cookie, API_KEY, hostname)
  //   logger.info('request to handle user\'s feature list success:', {
  //     cookie, ip: ctx.request.ip
  //   })
  // } catch (e) {
  //   ctx.throw(e.message, e.status)
  //   logger.warn('request to handle user\'s feature list fail:', {
  //     cookie, ip: ctx.request.ip
  //   })
  // }
  //
  // const responseObj = {
  //   featureList: user.features,
  //   deviceCode: cookie,
  //   initCode: responseString
  // }

  const validatedDeviceCode = Authentication.validateCode(deviceCode)
    ? deviceCode : Cookie.generate()
  const userCode = hashedUserId ? {
    userCode: Cookie.generate(hashedUserId)
  } : {}

  ctx.body = {
    deviceCode: validatedDeviceCode,
    ...userCode,
    featureList: [],
    initCode: 'yeah'
  }
  ctx.status = 200

  logger.info('----------------------------------------------------------------')
}
