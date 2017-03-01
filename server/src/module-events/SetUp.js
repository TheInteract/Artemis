import * as Cookie from '../cookies/Cookie'
import * as User from '../users/User'

import logger from 'winston'

const SetUp = async (ctx) => {
  const { API_KEY, ...body } = ctx.request.body
  const { deviceCode, hashedUserId } = body.userIdentity || {}
  const hostname = ctx.request.ip

  const validatedDeviceCode = User.validateCode(deviceCode)
    ? deviceCode : Cookie.generate()
  const userCode = hashedUserId ? {
    userCode: Cookie.generate(hashedUserId)
  } : {}

  const featureList = []

  ctx.body = {
    deviceCode: validatedDeviceCode,
    ...userCode,
    featureList,
    initCode: 'yeah'
  }
  ctx.status = 200

  logger.info('----------------------------------------------------------------')
}

export default SetUp
