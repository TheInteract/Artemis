const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleScrollEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.customerCode = this.customerCode
  this.fetch.post('/event/onscroll', data)
}

module.exports = handleScrollEvent
