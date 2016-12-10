const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const logger = require('winston')

const app = new Koa()

app.use(async (ctx, next) => {
    await next()
})

app.use(async (ctx) => {
    const options = { root: path.join(__dirname, '..', 'static') }
    await send(ctx, ctx.path, options)
})

app.listen(3000)
logger.info('collector listen on port 3000')
