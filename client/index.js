const BrowserFetch = require('./util/fetch')
const handleEvent = require('./events')
const overrideFetch = require('./util/overrider/FetchOverrider')
const overrideXMLHttpRequest = require('./util/overrider/XMLHttpRequestOverrider')

const baseUrl = process.env.COLLECTOR_BASE || process.env.COLLECTOR_BASE_DEV

function initialize (...rest) {
  const fetchObj = {
    fetch: new BrowserFetch(baseUrl),
    API_KEY_PUBLIC: rest[0],
  }

  // TODO: map ic with web url.
  window.addEventListener('load', handleEvent.bind(fetchObj, 'load'))
  window.addEventListener('click', handleEvent.bind(fetchObj, 'click'))
  window.addEventListener('mousemove', handleEvent.bind(fetchObj, 'mousemove'))
  // window.addEventListener('keydown', handleEvent.bind(fetchObj, 'keydown'))
  // window.addEventListener('scroll', handleEvent.bind(fetchObj, 'scroll'))
  // window.addEventListener('resize', handleEvent.bind(fetchObj, 'resize'))

  overrideFetch(handleEvent.bind(fetchObj, 'APICall'))
  overrideXMLHttpRequest(handleEvent.bind(fetchObj, 'APICall'))
}

initialize(window.i)
