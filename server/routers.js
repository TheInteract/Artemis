import * as Events from './events'
import * as Product from './src/products/Product'

import Router from 'koa-router'
import SetUp from './src/module-events/SetUp'
import endpoints from './util/endpoints'
import { saveEvent } from './util/save'

const router = new Router({ prefix: '/api' })

router.get('/healthz', (ctx) => { ctx.status = 200 })
router.post(endpoints.INIT_EVENT, Product.authorized, SetUp)
router.post(endpoints.LOAD_EVENT, Product.authorized, Events.onload)
router.post(endpoints.SAVE_EVENT, Product.authorized, saveEvent)

module.exports = router
