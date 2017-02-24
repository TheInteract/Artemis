const logger = require('winston')
const { setupCookie, setupUserCookie, handleCustomerOnload, addFeatureToExistingUser } = require('../util/init/init-utility')

const initEvent = async (ctx) => {
  const isMock = false
  const { body } = ctx.request
  const customerCode = body.customerCode
  const { hashedUserId } = body.userIdentity || {}
  const hostname = ctx.request.ip
  let cookie
  if (hashedUserId) {
    cookie = await setupUserCookie(hashedUserId, (body.userIdentity || {}).deviceCode)
  } else {
    cookie = await setupCookie((body.userIdentity || {}).deviceCode)
  }
  // const responseString = 'function(a,b,c,d,e){a.customerCode=function(b){a.i=b},d=b.createElement(c),e=b.getElementsByTagName(c)[0],d.async=!0,d.src="http://localhost:3000/analytics.js",e.parentNode.insertBefore(d,e)}(window,document,"script"),customerCode("' + customerCode + '", "' + hashedUserId + '");'
  const responseString = 'console.log(\'Hello I\\\'m interact\')'
  const responseObjMock = {'featureList': [ {'name': 'Card-1', 'version': 'A'}, {'name': 'Card-2', 'version': 'B'} ], 'deviceCode': 'test', 'initCode': responseString}
  let user
  try {
    user = await handleCustomerOnload(hashedUserId, cookie, customerCode, hostname, addFeatureToExistingUser)
    logger.info('request to handle user\'s feature list success:', { cookie, ip: ctx.request.ip })
  } catch (e) {
    ctx.throw(e.message, e.status)
    logger.warn('request to handle user\'s feature list fail:', { cookie, ip: ctx.request.ip })
  }
  const responseObj = {
    featureList: user.features,
    deviceCode: cookie,
    initCode: responseString
  }
  if (isMock) {
    ctx.body = responseObjMock
  } else {
    ctx.body = responseObj
  }
  logger.info('----------------------------------------------------------------')
  ctx.status = 200
}

module.exports = { initEvent }
