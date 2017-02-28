const logger = require('winston')
const InitUtility = require('../util/init/initUtility')

const initEvent = async ctx => {
  const body = ctx.request.body
  const customerCode = body.customerCode
  const { deviceCode, hashedUserId } = body.userIdentity || {}
  const hostname = ctx.request.ip

  // const cookie = hashedUserId
  //   ? await setupUserCookie(hashedUserId, deviceCode)
  //     : await setupCookie(deviceCode)

  // const responseString = 'console.log(\'Hello I\\\'m interact\')'
  //
  // let user
  //
  // try {
  //   user = await handleUserOnInit(hashedUserId, cookie, customerCode, hostname)
  //   logger.info('request to handle user\'s feature list success:', {
  //     cookie, ip: ctx.request.ip
  //   })
  // } catch (e) {
  //   ctx.throw(e.message, e.status)
  //   logger.warn('request to handle user\'s feature list fail:', {
  //     cookie, ip: ctx.request.ip
  //   })
  // }
  //
  // const responseObj = {
  //   featureList: user.features,
  //   deviceCode: cookie,
  //   initCode: responseString
  // }

  ctx.body = {
    deviceCode: await InitUtility.generateDeviceCode(deviceCode),
    userCode: await InitUtility.generateUserCode(hashedUserId)
  }
  ctx.status = 200

  logger.info('----------------------------------------------------------------')
}

module.exports = { initEvent }
