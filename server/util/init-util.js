const logger = require('winston')
const { authorized } = require('./auth')
const { wrapper } = require('./wrapper')
const { generateToken } = require('./token')
const UnauthorizedError = require('../errors/unauthorized')
const InvalidArgumentError = require('../errors/invalid-argument')
const { getUID, getCustomer, getFeatureUniqueCount, insertNewUser } = require('./mongo-utility')

const setupCookie = async (cookie) => {
  if (!cookie) {
    const timeStamp = new Date().getTime()
    const token = generateToken(timeStamp)
    logger.info('request to load event without cookie:', { cookie: token })
    return token
  } else {
    try {
      await authorized(cookie)
      logger.info('request to load event with cookie success:', { cookie })
      return cookie
    } catch (e) {
      logger.warn('request to load event with cookie fail:', { cookie })
      return setupCookie()
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
  var user = await wrapper(getUID)(uid, cookie, customerCode, hostname)
  var customer = await wrapper(getCustomer)(customerCode, hostname)
  if (!customer) {
    throw new UnauthorizedError()
  }
  if (!user) {
    //  Get the user result from mongo and return the feature set
    await wrapper(getFeatureUniqueCount)(customerCode, hostname, customer.features)
    await sortFeatureByCount(customer.features)
    user = await wrapper(insertNewUser)(uid, cookie, customerCode, hostname, customer.features)
    user = user.ops[0]
  }
  return user
}

module.exports = { setupCookie, sortFeatureByCount, handleCustomerOnload }
