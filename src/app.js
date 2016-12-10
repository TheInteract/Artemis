const Koa = require('koa')

const app = new Koa()

app.use(async (ctx, next) => {
    await next()
})

app.use(async (ctx) => {
    ctx.body = 'hello, I\'m Collector'
})

app.listen(3000)
