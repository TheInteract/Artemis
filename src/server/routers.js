const endpoints = require('../util/endpoints')
const Router = require('koa-router')
const logger = require('winston')
const config = require('config')
const events = require('./events')
const { authorized } = require('../util/auth')

const router = new Router({ prefix: '/api' })

async function checkPermission(ctx, next) {
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

router.post(endpoints.LOAD_EVENT, events.load.setupClient, events.load.handleEvent)

router.post(endpoints.SAVE_EVENT, checkPermission, async (ctx) => {
    const cookieName = config.get('cookie.name')
    const cookie = ctx.cookies.get(cookieName)
    const { body } = ctx.request
    const action = ctx.params.type

    try {
        await events[ctx.params.type].handleEvent(cookie, body)
        logger.info(`request to ${action} event success:`, { cookie, ip: ctx.request.ip })
        ctx.status = 200
    } catch (e) {
        logger.info(`request to ${action} event error:`, { cookie, ip: ctx.request.ip, error: e })
        ctx.throw(e.message, e.status)
    }
})

module.exports = router
