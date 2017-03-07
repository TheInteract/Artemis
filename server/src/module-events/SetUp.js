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

  ctx.body = {
    ...Codes.getUserCode(hashedUserId),
    deviceCode: validatedDeviceCode,
    featureList: await FeatureLists.getFeatureList(product._id, user._id),
    initCode: getInitCode(),
  }
  ctx.status = 200
  console.log(ctx.body)
}

const getInitCode = () => (
  `console.log('hello')`
)

export default SetUp
