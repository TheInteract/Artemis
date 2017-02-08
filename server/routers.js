const endpoints = require('./util/endpoints')
const Router = require('koa-router')
const logger = require('winston')
const config = require('config')
const events = require('./events')
const { identifyClient, checkPermission } = require('./util/auth')

const router = new Router({ prefix: '/api' })

router.get('/healthz', (ctx) => {
  ctx.status = 200
})

router.post(endpoints.LOAD_EVENT, identifyClient, events.load.setupClient, events.load.handleEvent)

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
