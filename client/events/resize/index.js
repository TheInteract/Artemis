const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleResizeEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.ic = this.ic
  this.fetch.post('/event/resize', data)
}

module.exports = handleResizeEvent
