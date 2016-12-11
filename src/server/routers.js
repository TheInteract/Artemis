const endpoints = require('../util/endpoints')
const Router = require('koa-router')
const { authorized } = require('../util/auth')
const { generateToken } = require('../util/token')

const router = new Router({ prefix: '/api' })

async function checkPermission(ctx, next) {
    const { authorization } = ctx.headers
    try {
        await authorized(authorization)
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
