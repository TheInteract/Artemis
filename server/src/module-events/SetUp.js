import * as Codes from '../codes/Codes'
import * as FeatureLists from '../feature-list/FeatureLists'
import * as Products from '../products/Products'
import * as Users from '../users/Users'

import config from 'config'

const SetUp = async ctx => {
  const { body } = ctx.request
  const { API_KEY_PRIVATE } = body
  const { hashedUserId, deviceCode } = body.userIdentity || {}

  const product = await Products.getProductByPrivateKey(API_KEY_PRIVATE)
  const validatedDeviceCode = Codes.getDeviceCode(deviceCode)
  const user = await Users.getUser(hashedUserId, validatedDeviceCode)

  const API_KEY_PUBLIC = product.API_KEY_PUBLIC

  ctx.body = {
    ...Codes.getUserCode(hashedUserId),
    deviceCode: validatedDeviceCode,
    featureList: await FeatureLists.getFeatureList(product._id, user._id),
    initCode: getInitCode(API_KEY_PUBLIC),
  }
  ctx.status = 200
}

const getInitCode = (API_KEY_PUBLIC) => {
  let url = config.get('server.host')
  if (process.env.NODE_ENV === 'development') {
    url += `:${config.get('server.port')}`
  }
  return `!function(e,t,n,c,a){e.INIT=function(t){e.i=t},c=t.createElement(n),a=t.getElementsByTagName(n)[0],c.async=!0,c.src="http://${url}/analytics.js",a.parentNode.insertBefore(c,a)}(window,document,"script"),INIT("${API_KEY_PUBLIC}");`
}

export default SetUp
