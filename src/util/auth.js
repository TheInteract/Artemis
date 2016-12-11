const UnauthorizedError = require('../errors/unauthorized')
const { split } = require('lodash')
const token = require('./token')

async function authorized(authorization) {
    const header = split(authorization, ' ', 2)[1]
    if (header === undefined) {
        throw new UnauthorizedError()
    }

    const timeStamp = split(header, ':', 2)[0]
    // TODO: check token from database
    if (token.generateToken(timeStamp) !== header) {
        throw new UnauthorizedError()
    }
    return true
}

module.exports = { authorized }
