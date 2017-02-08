const { generateToken } = require('../util/token')
const { authorized, getUID, getCustomer, getFeatureUniqueCount, insertNewUser } = require('../util/auth')
const logger = require('winston')
const config = require('config')
const omit = require('lodash/omit')
const store = require('../util/store')
const url = require('url')
const { wrapper } = require('../util/wrapper')

const setupClient = async (ctx, next) => {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)

  if (!cookie) {
    const timeStamp = new Date().getTime()
    const token = generateToken(timeStamp)
    ctx.cookies.set(cookieName, token)
    ctx.state.tmpCookie = token
    logger.info('request to load event without cookie:', { cookie: token, ip: ctx.request.ip })
  } else {
    try {
      await authorized(cookie)
      logger.info('request to load event with cookie success:', { cookie, ip: ctx.request.ip })
    } catch (e) {
      ctx.throw(e.message, e.status)
      logger.warn('request to load evnet with cookie fail:', { cookie, ip: ctx.request.ip })
    }
  }
  await next()
  ctx.status = 200
}

const handleEvent = async (ctx) => {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName) || ctx.state.tmpCookie
  const { body } = ctx.request
  const { ic } = body
  const uid = cookie
  const rest = omit(body, [ 'ic' ])
  const hostname = url.parse(ctx.request.origin).hostname
  await store.save(ic, uid, rest, 'load')
  var user = await wrapper(getUID)(uid, ic, hostname)
  var customer = await wrapper(getCustomer)(ic, hostname)
  if (!user) {
    //  Get the user result from mongo and return the feature set
    await wrapper(getFeatureUniqueCount)(ic, hostname, customer.features)
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
      feature.types.sort(sorter)
    }
    user = await wrapper(insertNewUser)(uid, ic, hostname, customer.features)
    user = user.ops[0]
  }
  const responseObj = {
    uid: user.uid,
    enabledFeatures: user.features
  }
  ctx.body = responseObj
  logger.info(responseObj)
}

module.exports = { handleEvent, setupClient }
