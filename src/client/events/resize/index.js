const PROPERTIES = require('./properties')
const pickProperties = require('../../../util/pickProperties')

function handleResizeEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.uid = this.uid
  this.fetch.post('/event/resize', data)
}

module.exports = handleResizeEvent
