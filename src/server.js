const logger = require('winston')
const config = require('config')
const send = require('koa-send')
const path = require('path')
const Koa = require('koa')

const app = module.exports = new Koa()

app.use(async (ctx, next) => {
    await next()
})

app.use(async (ctx) => {
    const options = { root: path.join(__dirname, '..', 'static') }
    await send(ctx, ctx.path, options)
})

const port = config.get('server.port')

if (!module.parent.parent) app.listen(port)
logger.info('TheCollector server listen on port:', port)
