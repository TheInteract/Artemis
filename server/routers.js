const endpoints = require('./util/endpoints')
const Router = require('koa-router')
const logger = require('winston')
const config = require('config')
const events = require('./events')
const { authorized, identify } = require('./util/auth')
const url = require('url')

const router = new Router({ prefix: '/api' })

async function identifyClient (ctx, next) {
  const hostname = url.parse(ctx.request.origin).hostname
  const { uid } = ctx.request.body
  logger.info('identify client request', { uid, hostname })

  try {
    await identify(uid, hostname)
    logger.info('identify client success', { uid, hostname })
    await next()
  } catch (e) {
    logger.error(`identify client(${uid}) fail`, { message: e.message })
    ctx.throw(e.message, e.status)
  }
}

async function checkPermission (ctx, next) {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)
  // TODO: if browser is disable a cookie, we should provide localStorage and set token with header
  try {
    await authorized(cookie)
    await next()
  } catch (e) {
    ctx.throw(e.message, e.status)
  }
}

router.get('/healthz', (ctx) => {
  ctx.status = 200
})

router.post(endpoints.LOAD_EVENT, events.load.handleEvent)

router.post(endpoints.SAVE_EVENT, identifyClient, checkPermission, async (ctx) => {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)
  const { body } = ctx.request
  const action = ctx.params.type
  // An error should not throw to client side.
  try {
    await events[ctx.params.type].handleEvent(cookie, body)
    logger.info(`request to ${action} event success:`, { cookie, ip: ctx.request.ip })
    ctx.status = 200
    if (!ctx.body) {
      ctx.body = {}
    }
  } catch (e) {
    logger.info(`request to ${action} event error:`, { cookie, ip: ctx.request.ip, error: e })
    ctx.throw(e.message, e.status)
  }
})

module.exports = router
