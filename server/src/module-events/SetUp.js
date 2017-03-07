import * as Codes from '../codes/Codes'
import * as FeatureLists from '../feature-list/FeatureLists'
import * as Products from '../products/Products'
import * as Users from '../users/Users'

const SetUp = async ctx => {
  const { body, ip } = ctx.request
  const { API_KEY_PRIVATE } = body
  const { hashedUserId, deviceCode } = body.userIdentity || {}

  const product = await Products.getProductByPrivateKey(API_KEY_PRIVATE, ip)
  const validatedDeviceCode = Codes.getDeviceCode(deviceCode)
  const user = await Users.getUser(hashedUserId, validatedDeviceCode)

  const API_KEY_PUBLIC = '12345'

  ctx.body = {
    ...Codes.getUserCode(hashedUserId),
    deviceCode: validatedDeviceCode,
    featureList: await FeatureLists.getFeatureList(product._id, user._id),
    initCode: getInitCode(API_KEY_PUBLIC),
  }
  ctx.status = 200
  console.log(ctx.body)
}

const getInitCode = (API_KEY_PUBLIC) => (
  `!function(e,t,n,c,a){e.INIT=function(t){e.i=t},c=t.createElement(n),a=t.getElementsByTagName(n)[0],c.async=!0,c.src="http://10.2.61.137:3000/analytics.js",a.parentNode.insertBefore(c,a)}(window,document,"script"),INIT("${API_KEY_PUBLIC}");`
)

export default SetUp
