const Koa = require('koa')
const send = require('koa-send')
const path = require('path')

const app = new Koa()

app.use(async (ctx, next) => {
    await next()
})

app.use(async (ctx) => {
    const options = { root: path.join(__dirname, '..', 'static') }
    await send(ctx, ctx.path, options)
})

app.listen(3000)
