import * as HandleEvent from './src/module-events/HandleEvent'
import * as Product from './src/products/Product'

import Router from 'koa-router'
import SetUp from './src/module-events/SetUp'
import config from 'config'
import endpoints from './util/endpoints'

const apiRouter = new Router({ prefix: config.prefix })

apiRouter.get('/healthz', (ctx) => { ctx.status = 200 })
apiRouter.post(endpoints.INIT_EVENT, Product.authorized, SetUp)
apiRouter.post(endpoints.EVENTS, HandleEvent.checkClientCode, Product.clientAuthorization, HandleEvent.sendToRedis)

module.exports = {apiRouter}
