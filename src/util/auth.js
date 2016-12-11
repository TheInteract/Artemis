const config = require('config')
const crypto = require('crypto')
const { split } = require('lodash')

function generateToken(timeStamp) {
    timeStamp = timeStamp || String(new Date().getTime())
    const hash = crypto.createHmac('sha512', config.get('secret.key')).update(timeStamp)
    const token = hash.digest('hex')
    return `${timeStamp}:${token}`
}

async function auth(ctx, next) {
    const { Authorization } = ctx.headers
    const header = split(Authorization, ' ', 2)[1]
    if (header === undefined) {
        ctx.throw('token is undefined', 401)
    }

    const timeStamp = split(header, ':', 2)[0]
    // TODO: check token from database
    if (generateToken(timeStamp) === header) {
        await next()
    } else {
        ctx.throw('token is invalid', 401)
    }
}

module.exports = { auth, generateToken }
