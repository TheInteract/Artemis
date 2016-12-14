const { generateToken } = require('../../util/token')
const { authorized } = require('../../util/auth')
const logger = require('winston')
const config = require('config')

const handleEvent = async (ctx) => {
    const cookieName = config.get('cookie.name')
    const cookie = ctx.cookies.get(cookieName) || ctx.state.tmpCookie
    console.log(`body`, ctx.request.body)
}

const setupClient = async (ctx, next) => {
    const cookieName = config.get('cookie.name')
    const cookie = ctx.cookies.get(cookieName)

    if (!cookie) {
        const timeStamp = new Date().getTime()
        const token = generateToken(timeStamp)
        ctx.cookies.set(cookieName, token)
        ctx.state.tmpCookie = token
        logger.info('request to load event without cookie:', { cookie: token, ip: ctx.request.ip })
    } else {
        try {
            await authorized(cookie)
            logger.info('request to load event with cookie success:', { cookie, ip: ctx.request.ip })
        } catch (e) {
            ctx.throw(e.message, e.status)
            logger.warn('request to load evnet with cookie fail:', { cookie, ip: ctx.request.ip })
        }
    }
    await next()
    ctx.status = 200
}

module.exports = { handleEvent, setupClient }
