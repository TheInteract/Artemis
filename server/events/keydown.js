const omit = require('lodash/omit')
const store = require('../util/store')

const handleEvent = async (cookie, body) => {
  const { customerCode } = body
  const rest = omit(body, [ 'customerCode' ])
  await store.save(customerCode, cookie, rest, 'keydown')
}

module.exports = { handleEvent }
