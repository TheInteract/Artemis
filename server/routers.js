import * as Events from './events'
import Router from 'koa-router'
import endpoints from './util/endpoints'
import * as Product from './src/products/Product'
import { checkCookie } from './util/AuthUtil'
import { saveEvent } from './util/save'

const router = new Router({ prefix: '/api' })

router.get('/healthz', (ctx) => { ctx.status = 200 })
router.post(endpoints.INIT_EVENT, Product.authorized, Events.OnInit)
router.post(endpoints.LOAD_EVENT, Product.authorized, checkCookie, Events.OnLoad)
router.post(endpoints.SAVE_EVENT, Product.authorized, saveEvent)

module.exports = router
