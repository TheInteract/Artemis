const endpoints = require('../util/endpoints')
const Router = require('koa-router')
const { auth } = require('../util/auth')

const router = new Router({ prefix: '/api' })

router.get(endpoints.REGISTER, async (ctx) => {
    ctx.body = { reg: true }
})

router.get(endpoints.SAVE_EVENT, auth, async (ctx) => {
    ctx.body = { test: 'json' }
})

module.exports = router
