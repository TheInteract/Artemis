import * as Codes from '../codes/Codes'
import * as FeatureLists from '../feature-list/FeatureLists'
import * as Products from '../products/Products'
import * as Users from '../users/Users'

const SetUp = async ctx => {
  const { body, ip } = ctx.request
  const { API_KEY_PRIVATE } = body
  const { hashedUserId, deviceCode } = body.userIdentity || {}

  const product = Products.getProduct(API_KEY_PRIVATE, ip)
  const user = Users.getUser(hashedUserId, deviceCode)

  ctx.body = {
    ...Codes.getUserCode(),
    deviceCode: Codes.getDeviceCode(deviceCode),
    featureList: await FeatureLists.getFeatureList(product, user),
    initCode: getInitCode(),
  }
  ctx.status = 200
}

const getInitCode = () => (
  `console.log('hello')`
)

export default SetUp
