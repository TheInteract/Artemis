const omit = require('lodash/omit')
const store = require('../util/store')

const handleEvent = async (cookie, body) => {
  const { ic } = body
  const rest = omit(body, [ 'ic' ])
  await store.save(ic, cookie, rest, 'keydown')
}

module.exports = { handleEvent }
