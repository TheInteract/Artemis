const APIProperties = require('./APICall/properties')
const clickProperties = require('./click/properties')
const keydownProperties = require('./keydown/properties')
const loadProperties = require('./load/properties')
const mousemoveProperties = require('./mousemove/properties')
const resizeProperties = require('./resize/properties')
const scrollProperties = require('./scroll/properties')
const pickProperties = require('../util/pickProperties')

const propertiesObject = {
  APICall: APIProperties,
  click: clickProperties,
  keydown: keydownProperties,
  load: loadProperties,
  mousemove: mousemoveProperties,
  resize: resizeProperties,
  scroll: scrollProperties
}

let prevTime = {
  mousemove: new Date(0),
  resize: new Date(0)
}

function handleEvent (type, event) {
  const data = pickProperties(event, propertiesObject[type])
  if (type === 'mousemove' || type === 'resize') {
    const now = new Date()
    if (now - prevTime[type] > 500) {
      prevTime[type] = new Date()
    } else {
      return
    }
  } else if (type === 'APICall') {
    if (data.url.includes(process.env.COLLECTOR_BASE || 'http://localhost:3000/')) return
  }

  data.API_KEY_PUBLIC = this.API_KEY_PUBLIC
  this.fetch.post('/event/on' + type, data)
}

module.exports = handleEvent
