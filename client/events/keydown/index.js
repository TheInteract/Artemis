const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleKeydownEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.customerCode = this.customerCode
  this.fetch.post('/event/onkeydown', data)
}

module.exports = handleKeydownEvent
