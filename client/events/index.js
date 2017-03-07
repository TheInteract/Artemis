const APIProperties = require('./APICall/properties')
const clickProperties = require('./click/properties')
const keydownProperties = require('./keydown/properties')
const loadProperties = require('./load/properties')
const mousemoveProperties = require('./mousemove/properties')
const resizeProperties = require('./resize/properties')
const scrollProperties = require('./scroll/properties')
const pickProperties = require('../util/pickProperties')
const url = require('url')

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

function callFetch (fetch, type, data) {
  fetch.post('/event/on' + type, data)
}

function requestIsNotInDelay (type) {
  const now = new Date()
  if (now - prevTime[type] > 500) {
    prevTime[type] = new Date()
    return true
  }
  return false
}

function isCallToProductEndPoint (targetHostname) {
  const productHostname = window.location.hostname
  const artemisHostname = url.parse(process.env.COLLECTOR_BASE || 'http://localhost:3000/').hostname
  return (targetHostname === productHostname && targetHostname !== artemisHostname)
}

function handleEvent (type, event) {
  const data = pickProperties(event, propertiesObject[type])
  const fetch = this.fetch
  data.API_KEY_PUBLIC = this.API_KEY_PUBLIC

  if (!(
    ((type === 'mousemove' || type === 'resize') && !requestIsNotInDelay(type)) ||
    (type === 'APICall' && !isCallToProductEndPoint(data.url.hostname))
  )) {
    callFetch(fetch, type, data)
  }
}

module.exports = handleEvent
