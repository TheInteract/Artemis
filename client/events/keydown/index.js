const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleKeydownEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.uid = this.uid
  this.fetch.post('/event/keydown', data)
}

module.exports = handleKeydownEvent
