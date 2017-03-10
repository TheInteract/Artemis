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

let hasError = false
let prevTime = {
  mousemove: new Date(0),
  resize: new Date(0)
}

function isNotMouseMoveAndResize (type) {
  return type !== 'mousemove' && type !== 'resize'
}

function isNotAPICall (type) {
  return type !== 'APICall'
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

function callFetch (type, data) {
  this.fetch.post('/event/on' + type, data).catch(function () {
    hasError = true
  })
}

function handleEvent (type, event) {
  const data = pickProperties(event, propertiesObject[type])
  data.API_KEY_PUBLIC = this.API_KEY_PUBLIC

  // if (!(
  //   (isMouseMoveAndResize(type) && !requestIsNotInDelay(type)) ||
  //   (isAPICall(type) && !isCallToProductEndPoint(data.url.hostname))
  // ) && !hasError) {
  //   callFetch.apply(this, [ type, data ])
  // }

  if ((isNotMouseMoveAndResize || requestIsNotInDelay) &&
    (isNotAPICall(type) || isCallToProductEndPoint) &&
    !hasError) {
    callFetch.apply(this, [ type, data ])
  }
}

module.exports = handleEvent
