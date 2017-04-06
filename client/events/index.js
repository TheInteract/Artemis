const mousemoveProperties = require('./mousemove/properties')
const pickProperties = require('../util/pickProperties')
const focusProperties = require('./focus/properties')
const APIProperties = require('./APICall/properties')
const clickProperties = require('./click/properties')
const blurProperties = require('./blur/properties')
const loadProperties = require('./load/properties')
const url = require('url')

const propertiesObject = {
  mousemove: mousemoveProperties,
  APICall: APIProperties,
  focus: focusProperties,
  click: clickProperties,
  load: loadProperties,
  blur: blurProperties
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

function isAPICall (type) {
  return type === 'APICall'
}

function isMouseMoveOrResize (type) {
  return type === 'mousemove' || type === 'resize'
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
  const artemisHostname = url.parse(process.env.COLLECTOR_BASE || process.env.COLLECTOR_BASE_DEV).host
  return targetHostname !== artemisHostname
}

function callFetch (type, data) {
  this.fetch.post('/event/on' + type, data).catch(function () {
    hasError = true
  })
}

function conditionBeforeStoreEvent (type, optional) {
  if (isAPICall(type)) {
    return isCallToProductEndPoint(optional.host)
  } else if (isMouseMoveOrResize(type)) {
    return requestIsNotInDelay(type)
  } else {
    return true
  }
}

function handleEvent (type, event) {
  const data = pickProperties(event, propertiesObject[type])
  data.API_KEY_PUBLIC = this.API_KEY_PUBLIC
  data.versions = this.versions

  const { host } = (data.url || {})
  if (conditionBeforeStoreEvent(type, { host }) && !hasError) {
    callFetch.apply(this, [ type, data ])
  }
}

module.exports = handleEvent
