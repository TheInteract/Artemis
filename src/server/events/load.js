const { generateToken } = require('../../util/token')
const { authorized } = require('../../util/auth')
const config = require('config')

const handleEvent = async (ctx) => {
    const cookieName = config.get('cookie.name')
    console.log('handleEvent', ctx.cookies.get(cookieName))
}

const setupClient = async (ctx, next) => {
    const cookieName = config.get('cookie.name')
    const cookie = ctx.cookies.get(cookieName)
    if (!cookie) {
        const timeStamp = new Date().getTime()
        const token = generateToken(timeStamp)
        ctx.cookies.set(cookieName, token)
    } else {
        try {
            await authorized(cookie)
        } catch (e) {
            ctx.throw(e.message, e.status)
        }
    }
    await next()
    ctx.status = 200
}

module.exports = { handleEvent, setupClient }
