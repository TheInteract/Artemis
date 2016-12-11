const endpoints = require('../util/endpoints')
const Router = require('koa-router')
const { authorized, generateToken } = require('../util/auth')

const router = new Router({ prefix: '/api' })

async function checkPermission(ctx, next) {
    const { Authorization } = ctx.header
    try {
        await authorized(Authorization)
        next()
    } catch (e) {
        ctx.throw(e.message, e.status)
    }
}

router.get(endpoints.REGISTER, async (ctx) => {
    const timeStamp = new Date().getTime()
    const token = generateToken(timeStamp)
    ctx.body = { token }
})

router.get(endpoints.SAVE_EVENT, checkPermission, async (ctx) => {
    ctx.body = { test: 'json' }
})

module.exports = router
