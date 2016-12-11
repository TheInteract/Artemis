const config = require('config')
const crypto = require('crypto')
const UnauthorizedError = require('../errors/unauthorized')
const { split } = require('lodash')

function generateToken(timeStamp) {
    timeStamp = timeStamp || new Date().getTime()
    const hash = crypto.createHmac('sha512', config.get('secret.key')).update(timeStamp.toString())
    const token = hash.digest('hex')
    return `${timeStamp}:${token}`
}

async function authorized(authorization) {
    const header = split(authorization, ' ', 2)[1]
    if (header === undefined) {
        throw new UnauthorizedError()
    }

    const timeStamp = split(header, ':', 2)[0]
    // TODO: check token from database
    if (generateToken(timeStamp) !== header) {
        throw new UnauthorizedError()
    }
    return true
}

module.exports = { authorized, generateToken }
