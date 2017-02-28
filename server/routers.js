import * as Events from './events'
import Router from 'koa-router'
import endpoints from './util/endpoints'
import { identifyCustomer, checkCookie } from './util/AuthUtil'
import { saveEvent } from './util/save'

const router = new Router({ prefix: '/api' })

router.get('/healthz', (ctx) => { ctx.status = 200 })
router.post(endpoints.INIT_EVENT, identifyCustomer, Events.OnInit)
router.post(endpoints.LOAD_EVENT, identifyCustomer, checkCookie, Events.OnLoad)
router.post(endpoints.SAVE_EVENT, identifyCustomer, checkCookie, saveEvent)

module.exports = router
