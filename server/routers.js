import * as HandleEvent from './src/module-events/HandleEvent'
import * as Product from './src/products/Product'

import Router from 'koa-router'
import SetUp from './src/module-events/SetUp'
import config from 'config'
import endpoints from './util/endpoints'
import path from 'path'
import send from 'koa-send'

const apiRouter = new Router({ prefix: config.prefix + 'api' })

apiRouter.get('/healthz', (ctx) => { ctx.status = 200 })
apiRouter.post(endpoints.INIT_EVENT, Product.authorized, SetUp)
apiRouter.post(endpoints.EVENTS, HandleEvent.checkClientCode, Product.clientAuthorization, HandleEvent.sendToRedis)

const staticRouter = new Router()

staticRouter.use('/collector', async (ctx) => {
  const options = { root: path.join(__dirname, 'static') }
  await send(ctx, ctx.path, options)
})

module.exports = {apiRouter, staticRouter}
