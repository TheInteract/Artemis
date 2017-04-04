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
  // const productHostname = window.location.hostname
  const artemisHostname = url.parse(process.env.COLLECTOR_BASE || process.env.COLLECTOR_BASE_DEV).host
  // return (targetHostname === productHostname && targetHostname !== artemisHostname)
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

  // if (!(
  //   (isMouseMoveAndResize(type) && !requestIsNotInDelay(type)) ||
  //   (isAPICall(type) && !isCallToProductEndPoint(data.url.hostname))
  // ) && !hasError) {
  //   callFetch.apply(this, [ type, data ])
  // }

  // if ((isNotMouseMoveAndResize(type) || requestIsNotInDelay(type)) &&
  //   (isNotAPICall(type) || isCallToProductEndPoint(type)) &&
  //   !hasError) {
  //   callFetch.apply(this, [ type, data ])
  // }

  const { host } = (data.url || {})
  if (conditionBeforeStoreEvent(type, { host }) && !hasError) {
    callFetch.apply(this, [ type, data ])
  }
}

module.exports = handleEvent
