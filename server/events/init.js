import * as Cookie from '../src/cookies/Cookie'
import * as Authentication from '../src/users/User'

import logger from 'winston'

export default async function init (ctx) {
  const body = ctx.request.body
  const API_KEY = body.API_KEY
  const { deviceCode, hashedUserId } = body.userIdentity || {}
  const hostname = ctx.request.ip

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
