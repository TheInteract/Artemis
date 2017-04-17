const BrowserFetch = require('./util/fetch')
const handleEvent = require('./events')
const overrideFetch = require('./util/overrider/FetchOverrider')
const overrideXMLHttpRequest = require('./util/overrider/XMLHttpRequestOverrider')
const Cookie = require('js-cookie')

const baseUrl = process.env.COLLECTOR_BASE || process.env.COLLECTOR_BASE_DEV

function initialize (...rest) {
  const fetchObj = {
    fetch: new BrowserFetch(baseUrl, {
      'Device-Code': Cookie.get('interact-device-code'),
      'User-Code': Cookie.get('interact-user-code')
    }),
    API_KEY_PUBLIC: rest[0],
    versions: rest[1],
    sessionCode: Math.random().toString(36).substring(2)
  }

  // TODO: map ic with web url.
  window.addEventListener('load', handleEvent.bind(fetchObj, 'load'))
  window.addEventListener('click', handleEvent.bind(fetchObj, 'click'))
  window.addEventListener('focus', handleEvent.bind(fetchObj, 'focus'))
  window.addEventListener('blur', handleEvent.bind(fetchObj, 'blur'))
  window.addEventListener('beforeunload', handleEvent.bind(fetchObj, 'unload'))
    // window.addEventListener('mousemove', handleEvent.bind(fetchObj, 'mousemove'))
  overrideFetch(handleEvent.bind(fetchObj, 'APICall'))
  overrideXMLHttpRequest(handleEvent.bind(fetchObj, 'APICall'))
}

initialize(window.i, window.v)
