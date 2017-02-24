const config = require('config')
const crypto = require('crypto')

function generateToken (timeStamp) {
  timeStamp = timeStamp || new Date().getTime()
  const hash = crypto.createHmac('sha512', config.get('secret.key')).update(String(timeStamp))
  const token = hash.digest('hex')
  return `${timeStamp}:${token}`
}

function generateHashToken (userHash) {
  const hash = crypto.createHmac('sha512', config.get('secret.userKey')).update(String(userHash))
  const token = hash.digest('hex')
  return `${userHash}:${token}`
}

module.exports = { generateToken, generateHashToken }
