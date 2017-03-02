import * as Cookie from '../cookies/Cookie'
import * as FeatureLists from '../feature-lists/FeatureLists'
import * as Products from '../products/Products'
import * as User from '../users/User'
import * as Users from '../users/Users'

const SetUp = async ctx => {
  const { body, ip } = ctx.request
  const { API_KEY_PRIVATE } = body
  const { hashedUserId, deviceCode } = body.userIdentity || {}

  const product = Products.getProduct(API_KEY_PRIVATE, ip)
  const user = getUser(hashedUserId, deviceCode)

  ctx.body = {
    ...getUserCode(),
    deviceCode: getValidatedDeviceCode(deviceCode),
    featureList: getFeatureList(user, product),
    initCode: getInitCode(),
  }
  ctx.status = 200
}

const getUserCode = hashedUserId => hashedUserId ? {
  userCode: Cookie.generate(hashedUserId)
} : {}

const getValidatedDeviceCode = deviceCode => User.validateCode(deviceCode)
  ? deviceCode : Cookie.generate()

const getUser = async (hashedUserId, deviceCode) => (
  await Users.getUser(hashedUserId, deviceCode) ||
    await Users.createUser(hashedUserId, deviceCode)
)

const getFeatureList = async (user, product) => {
  const featureListId = User.getFeatureListId(user, product)
  const featureList = await FeatureLists.getFeatureList(featureListId)
  return featureList ? await FeatureLists.syncFeafeatureList(featureList)
    : await FeatureLists.createFeatureList()
}

const getInitCode = () => (
  `console.log('hello')`
)

export default SetUp
