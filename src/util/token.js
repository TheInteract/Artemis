const config = require('config')
const crypto = require('crypto')

function generateToken(timeStamp) {
    timeStamp = timeStamp || new Date().getTime()
    const hash = crypto.createHmac('sha512', config.get('secret.key')).update(timeStamp.toString())
    const token = hash.digest('hex')
    return `${timeStamp}:${token}`
}

module.exports = { generateToken }