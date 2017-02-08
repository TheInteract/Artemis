const { generateToken } = require('../util/token')
const { authorized } = require('../util/auth')
const logger = require('winston')
const config = require('config')
const omit = require('lodash/omit')
const store = require('../util/store')

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
  // const cookieName = config.get('cookie.name')
  // const cookie = ctx.cookies.get(cookieName) || ctx.state.tmpCookie
  // const { body } = ctx.request
  // const { uid } = body
  // const rest = omit(body, [ 'uid' ])
  // await store.save(uid, cookie, rest, 'load')
  if (!ctx) {
    logger.info('When the user is known')
    //  Get the user result from mongo and return the feature set
  } else {
    logger.info('When the user is unknown')
    /*
      Get the current ratio of product unique user and assign the new user to the appopriate side, save to mongo.
      Then return the feature set.
    */
  }
  const responseObj = {
    'uid': 'testUID',
    'enabledFeatures': [
      {
        'name': 'card-1',
        'type': 'A'
      },
      {
        'name': 'card-2',
        'type': 'B'
      }
    ]
  }
  ctx.body = responseObj
}

module.exports = { handleEvent, setupClient }
