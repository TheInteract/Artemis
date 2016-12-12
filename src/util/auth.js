const UnauthorizedError = require('../errors/unauthorized')
const { split } = require('lodash')
const token = require('./token')

async function authorized(cookie) {
    if (cookie === undefined) {
        throw new UnauthorizedError()
    }

    const timeStamp = split(cookie, ':', 2)[0]
    // TODO: check token from database
    if (token.generateToken(timeStamp) !== cookie) {
        throw new UnauthorizedError()
    }
    return true
}

module.exports = { authorized }
