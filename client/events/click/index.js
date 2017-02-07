const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleClickEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.uid = this.uid
  this.fetch.post('/event/click', data)
}

module.exports = handleClickEvent
