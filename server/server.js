const logger = require('winston')
const config = require('config')
const Koa = require('koa')
const cros = require('kcors')
const { apiRouter } = require('./routers')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const serve = require('koa-static')
const mount = require('koa-mount')

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

app.use(mount(config.prefix, serve(path.join(__dirname, './static'))))

const port = config.get('server.port')

if (!module.parent.parent) app.listen(port)
logger.info('TheCollector server listen on port:', port)
