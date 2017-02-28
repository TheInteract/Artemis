import logger from 'winston'
import addFunction from './featureManipulator'
import AuthUtility from '../AuthUtility'
import UnauthorizedError from '../../errors/unauthorized'
import CookieUtil from '../CookieUtil'
import InvalidArgumentError from '../../errors/invalid-argument'
import MongoUtility from '../mongoUtility'

export const generateDeviceCode = async (currentDeviceCode) => {
  try {
    await AuthUtility.authorized(currentDeviceCode)
    logger.info('successfully authorized currentDeviceCode:', { currentDeviceCode })
    return currentDeviceCode
  } catch (e) {
    logger.warn('failed to authorize currentDeviceCode:', { currentDeviceCode })
    const deviceCode = CookieUtil.generate()
    logger.info('generated new deviceCode:', { deviceCode })
    return deviceCode
  }
}

export const generateUserCode = async (hashedUserId) => {
  const userCode = CookieUtil.generate(hashedUserId)
  logger.info('generated user code:', { hashedUserId, userCode })
  return userCode
}

export const sortFeatureByCount = async (features) => {
  const sorter = function (a, b) {
    if (a.count < b.count) return -1
    if (a.count > b.count) return 1
    return 0
  }
  try {
    for (let feature of features) {
      feature.versions.sort(sorter)
    }
  } catch (e) {
    throw new InvalidArgumentError()
  }
}

export const handleUserOnInit = async (uid, cookie, customerCode, hostname) => {
  let user = await MongoUtility.getUser(uid, cookie, customerCode, hostname)
  let customer = await MongoUtility.getCustomer(customerCode, hostname)
  if (!customer) {
    throw new UnauthorizedError()
  }
  await MongoUtility.getFeatureUniqueCount(customerCode, hostname, customer.features)
  await sortFeatureByCount(customer.features)
  if (!user) {
    logger.info('handle customer: user not found')
    //  Get the user result from mongo and return the feature set
    user = await MongoUtility.insertNewUser(uid, cookie, customerCode, hostname, customer.features)
  } else {
    logger.info('handle customer: user found')
    user = await addFunction.syncFeatureList(user, customer)
  }
  return user
}
