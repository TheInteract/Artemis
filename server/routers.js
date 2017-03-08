import * as Product from './src/products/Product'

import Router from 'koa-router'
import SetUp from './src/module-events/SetUp'
import * as HandleEvent from './src/module-events/HandleEvent'
import endpoints from './util/endpoints'

const router = new Router({ prefix: '/api' })

router.get('/healthz', (ctx) => { ctx.status = 200 })
router.post(endpoints.INIT_EVENT, Product.authorized, SetUp)
// router.post(endpoints.LOAD_EVENT, HandleEvent.checkClientCode, HandleEvent.sendToRedis)
router.post(endpoints.SAVE_EVENT, HandleEvent.checkClientCode, HandleEvent.sendToRedis)

module.exports = router
