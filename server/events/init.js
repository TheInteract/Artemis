const url = require('url')
const logger = require('winston')
const { authorized } = require('../util/auth')
const { wrapper } = require('../util/wrapper')
const { generateToken } = require('../util/token')
const { getUID, getCustomer, getFeatureUniqueCount, insertNewUser } = require('../util/mongo-utility')

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
    }
  }
}

const handleCustomerOnload = async (uid, cookie, customerCode, hostname) => {
  var user = await wrapper(getUID)(uid, cookie, customerCode, hostname)
  var customer = await wrapper(getCustomer)(customerCode, hostname)
  if (!user) {
    //  Get the user result from mongo and return the feature set
    await wrapper(getFeatureUniqueCount)(customerCode, hostname, customer.features)
    const sorter = function (a, b) {
      if (a.count < b.count) {
        return -1
      }
      if (a.count > b.count) {
        return 1
      }
      return 0
    }
    for (let feature of customer.features) {
      feature.versions.sort(sorter)
    }
    user = await wrapper(insertNewUser)(uid, cookie, customerCode, hostname, customer.features)
    user = user.ops[0]
  }
  return user
}

const initEvent = async (ctx) => {
  const isMock = true
  const hostname = url.parse(ctx.request.origin).hostname
  const { body } = ctx.request
  const { hashedUserId } = body.userIdentity
  const customerCode = body.customerCode
  const cookie = setupCookie(body.useridentity.deviceCode)
  const responseString = 'function(a,b,c,d,e){a.customerCode=function(b){a.i=b},d=b.createElement(c),e=b.getElementsByTagName(c)[0],d.async=!0,d.src="http://localhost:3000/analytics.js",e.parentNode.insertBefore(d,e)}(window,document,"script"),customerCode("' + customerCode + '", "' + hashedUserId + '");'
  const responseObjMock = {
    'featureList': [
      {
        'name': 'Card-1',
        'version': 'A'
      },
      {
        'name': 'Card-2',
        'version': 'B'
      }
    ],
    'deviceCode': cookie,
    'initCode': responseString
  }
  var user
  try {
    user = handleCustomerOnload(hashedUserId, cookie, customerCode, hostname)
    logger.info('request to handle user\'s feature list success:', { hashedUserId, ip: ctx.request.ip })
  } catch (e) {
    ctx.throw(e.message, e.status)
    logger.warn('request to handle user\'s feature list fail:', { hashedUserId, ip: ctx.request.ip })
  }
  const responseObj = {
    enabledFeatures: user.features,
    code: responseString,
    cookie: cookie
  }
  if (isMock) {
    ctx.body = responseObjMock
  } else {
    ctx.body = responseObj
  }
  ctx.status = 200
  logger.info('Responsed mock init event uid = ' + hashedUserId)
}

module.exports = { initEvent }
