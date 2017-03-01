import * as Cookie from '../cookies/Cookie'
import * as FeatureLists from '../feature-lists/FeatureLists'
import * as Products from '../products/Products'
import * as User from '../users/User'
import * as Users from '../users/Users'

import logger from 'winston'

const SetUp = async (ctx) => {
  const { API_KEY_PRIVATE, ...body } = ctx.request.body
  const { hashedUserId, deviceCode } = body.userIdentity || {}
  const ip = ctx.request.ip

  const userCode = hashedUserId ? {
    userCode: Cookie.generate(hashedUserId)
  } : {}
  const validatedDeviceCode = User.validateCode(deviceCode)
    ? deviceCode : Cookie.generate()

  const product = Products.getProduct(API_KEY_PRIVATE, ip)
  const user = Users.getUser(hashedUserId, deviceCode)
  const featureList = FeatureLists.getFeatureList(user, product)

  ctx.body = {
    ...userCode,
    deviceCode: validatedDeviceCode,
    featureList,
    initCode: 'yeah'
  }
  ctx.status = 200

  logger.info('----------------------------------------------------------------')
}

export default SetUp
