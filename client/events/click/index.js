const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleClickEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.customerCode = this.customerCode
  this.fetch.post('/event/onclick', data)
}

module.exports = handleClickEvent
