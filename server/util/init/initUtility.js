import * as AuthUtil from '../AuthUtil'
import * as CookieUtil from '../CookieUtil'

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
