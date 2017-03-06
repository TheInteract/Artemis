const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleResizeEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.API_KEY_PUBLIC = this.API_KEY_PUBLIC
  this.fetch.post('/event/onresize', data)
}

module.exports = handleResizeEvent
