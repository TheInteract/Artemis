const logger = require('winston')
const config = require('config')
const Koa = require('koa')
const cros = require('kcors')
const { apiRouter, staticRouter } = require('./routers')
const bodyParser = require('koa-bodyparser')

const app = module.exports = new Koa()

app.proxy = true
app.use(cros({
  credentials: true,
}))
app.use(bodyParser({
  enableTypes: [ 'json' ],
}))
app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())
app.use(staticRouter.routes())
app.use(staticRouter.allowedMethods())

const port = config.get('server.port')

if (!module.parent.parent) app.listen(port)
logger.info('TheCollector server listen on port:', port)
