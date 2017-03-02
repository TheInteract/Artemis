const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleClickEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.API_KEY = this.API_KEY
  this.fetch.post('/event/onclick', data)
}

module.exports = handleClickEvent
