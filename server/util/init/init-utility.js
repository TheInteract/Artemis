const logger = require('winston')
const { authorized, hashAuthorized } = require('../auth')
const { wrapper } = require('../wrapper')
const { generateToken, generateHashToken } = require('../token')
const UnauthorizedError = require('../../errors/unauthorized')
const InvalidArgumentError = require('../../errors/invalid-argument')
const { getUID, getCustomer, getFeatureUniqueCount, insertNewUser } = require('../mongo-utility')
const addFunction = require('./featureManipulator')

const setupCookie = async (cookie) => {
  if (!cookie) {
    const timeStamp = new Date().getTime()
    const token = generateToken(timeStamp)
    logger.info('request to init event without device cookie:', { cookie: token })
    return token
  } else {
    try {
      await authorized(cookie)
      logger.info('request to init event with device cookie success:', { cookie })
      return cookie
    } catch (e) {
      logger.warn('request to init event with device cookie fail:', { cookie })
      return await setupCookie()
    }
  }
}

const setupUserCookie = async (hashedUserId, cookie) => {
  if (!cookie) {
    const token = generateHashToken(hashedUserId)
    logger.info('request to init event without user cookie:', { cookie: token })
    return token
  } else {
    try {
      await hashAuthorized(cookie)
      logger.info('request to init event with user cookie success:', { cookie })
      return cookie
    } catch (e) {
      logger.warn('request to init event with user cookie fail:', { cookie })
      return await setupUserCookie(hashedUserId)
    }
  }
}

const sortFeatureByCount = async (features) => {
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

const handleCustomerOnload = async (uid, cookie, customerCode, hostname) => {
  let user = await wrapper(getUID)(uid, cookie, customerCode, hostname)
  let customer = await wrapper(getCustomer)(customerCode, hostname)
  if (!customer) {
    throw new UnauthorizedError()
  }
  await wrapper(getFeatureUniqueCount)(customerCode, hostname, customer.features)
  await sortFeatureByCount(customer.features)
  if (!user) {
    logger.info('handle customer: user not found')
    //  Get the user result from mongo and return the feature set
    user = await wrapper(insertNewUser)(uid, cookie, customerCode, hostname, customer.features)
  } else {
    logger.info('handle customer: user found')
    user = await addFunction.syncFeatureList(user, customer)
  }
  return user
}

module.exports = { setupCookie, setupUserCookie, sortFeatureByCount, handleCustomerOnload }
