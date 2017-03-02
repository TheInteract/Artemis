import InvalidArgumentError from '../../errors/invalid-argument'
import MongoUtility from '../mongoUtility'
import UnauthorizedError from '../../errors/unauthorized'
import addFunction from './featureManipulator'
import logger from 'winston'

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

export const handleUserOnInit = async (uid, cookie, API_KEY, hostname) => {
  let user = await MongoUtility.getUser(uid, cookie, API_KEY, hostname)
  let customer = await MongoUtility.getCustomer(API_KEY, hostname)
  if (!customer) {
    throw new UnauthorizedError()
  }
  await MongoUtility.getFeatureUniqueCount(API_KEY, hostname, customer.features)
  await sortFeatureByCount(customer.features)
  if (!user) {
    logger.info('handle customer: user not found')
    //  Get the user result from mongo and return the feature set
    user = await MongoUtility.insertNewUser(uid, cookie, API_KEY, hostname, customer.features)
  } else {
    logger.info('handle customer: user found')
    user = await addFunction.syncFeatureList(user, customer)
  }
  return user
}
