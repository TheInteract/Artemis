const logger = require('winston')
const config = require('config')
const send = require('koa-send')
const path = require('path')
const Koa = require('koa')
const cros = require('kcors')
const router = require('./routers')
const bodyParser = require('koa-bodyparser')

const app = module.exports = new Koa()

app.use(cros({
    credentials: true,
}))
app.use(bodyParser({
    enableTypes: ['json'],
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx) => {
    const options = { root: path.join(__dirname, '..', '..', 'static') }
    await send(ctx, ctx.path, options)
})

const port = config.get('server.port')

if (!module.parent.parent) app.listen(port)
logger.info('TheCollector server listen on port:', port)
