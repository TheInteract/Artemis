const endpoints = require('../util/endpoints')
const Router = require('koa-router')
const { authorized } = require('../util/auth')
const config = require('config')
const events = require('./events')

const router = new Router({ prefix: '/api' })

async function checkPermission(ctx, next) {
    const cookieName = config.get('cookie.name')
    const cookie = ctx.cookies.get(cookieName)
    // TODO: if browser is disable a cookie, we should provide localStorage and set token with header
    try {
        await authorized(cookie)
        next()
    } catch (e) {
        ctx.throw(e.message, e.status)
    }
}

router.post(endpoints.LOAD_EVENT, events.load.setupClient, events.load.handleEvent)

router.post(endpoints.SAVE_EVENT, checkPermission, async (ctx) => {
    ctx.body = { test: 'json' }
})

module.exports = router
