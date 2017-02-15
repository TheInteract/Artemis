const events = require('./events')
const Router = require('koa-router')
const endpoints = require('./util/endpoints')
const { identifyCustomer, checkCookie } = require('./util/auth')
const { saveEvent } = require('./util/save')

const router = new Router({ prefix: '/api' })

router.get('/healthz', (ctx) => { ctx.status = 200 })
router.post(endpoints.INIT_EVENT, identifyCustomer, events.init.initEvent)
router.post(endpoints.LOAD_EVENT, identifyCustomer, checkCookie, events.load.loadEvent)
router.post(endpoints.SAVE_EVENT, identifyCustomer, checkCookie, saveEvent)

module.exports = router
