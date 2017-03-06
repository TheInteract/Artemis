const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleScrollEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.API_KEY_PUBLIC = this.API_KEY_PUBLIC
  this.fetch.post('/event/onscroll', data)
}

module.exports = handleScrollEvent
