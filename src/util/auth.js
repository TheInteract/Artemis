const config = require('config')
const crypto = require('crypto')
const { split } = require('lodash')

async function auth(ctx, next) {
    const { Authorization } = ctx.headers
    const token = split(Authorization, ' ', 2)[1]
    // TODO: check token from database
    if (token !== undefined) {
        await next()
    } else {
        ctx.throw('token is invalid', 401)
    }
}

function generateToken() {
    const hash = crypto.createHmac('sha512', config.get('secret.key')).update(String(new Date().getTime()))
    const token = hash.digest('hex')
    return token
}

module.exports = { auth, generateToken }
