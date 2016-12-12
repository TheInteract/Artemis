const endpoints = require('../util/endpoints')
const Router = require('koa-router')
const { authorized } = require('../util/auth')
const { generateToken } = require('../util/token')
const config = require('config')

const router = new Router({ prefix: '/api' })

async function checkPermission(ctx, next) {
    const cookieName = config.get('cookie.name')
    const cookie = ctx.cookies.get(cookieName)
    try {
        await authorized(cookie)
        next()
    } catch (e) {
        ctx.throw(e.message, e.status)
    }
}

router.post(endpoints.LOAD_EVENT, async (ctx) => {
    const timeStamp = new Date().getTime()
    const token = generateToken(timeStamp)
    ctx.cookies.set(config.get('cookie.name'), token)
    ctx.status = 200
})

router.post(endpoints.SAVE_EVENT, checkPermission, async (ctx) => {
    ctx.body = { test: 'json' }
})

module.exports = router
