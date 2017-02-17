const url = require('url')
const logger = require('winston')
const { setupCookie, handleCustomerOnload } = require('../util/init-util')

const initEvent = async (ctx) => {
  const isMock = true
  const hostname = url.parse(ctx.request.origin).hostname
  const { body } = ctx.request
  const { hashedUserId } = body.userIdentity
  const customerCode = body.customerCode
  const cookie = setupCookie(body.useridentity.deviceCode)
  const responseString = 'function(a,b,c,d,e){a.customerCode=function(b){a.i=b},d=b.createElement(c),e=b.getElementsByTagName(c)[0],d.async=!0,d.src="http://localhost:3000/analytics.js",e.parentNode.insertBefore(d,e)}(window,document,"script"),customerCode("' + customerCode + '", "' + hashedUserId + '");'
  const responseObjMock = {'featureList': [ {'name': 'Card-1', 'version': 'A'}, {'name': 'Card-2', 'version': 'B'} ], 'deviceCode': cookie, 'initCode': responseString}
  var user
  try {
    user = handleCustomerOnload(hashedUserId, cookie, customerCode, hostname)
    logger.info('request to handle user\'s feature list success:', { hashedUserId, ip: ctx.request.ip })
  } catch (e) {
    ctx.throw(e.message, e.status)
    logger.warn('request to handle user\'s feature list fail:', { hashedUserId, ip: ctx.request.ip })
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
  ctx.status = 200
  logger.info('Responsed mock init event uid = ' + hashedUserId)
}

module.exports = { initEvent }
