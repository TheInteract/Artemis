const BrowserFetch = require('./util/fetch')
const handleLoadEvent = require('./events/load')
const handleClickEvent = require('./events/click')
const handleKeydownEvent = require('./events/keydown')
const handleScrollEvent = require('./events/scroll')
const handleResizeEvent = require('./events/resize')
const handleMousemoveEvent = require('./events/mousemove')

const baseUrl = process.env.COLLECTOR_BASE || 'http://localhost:3000/'

function customerCode (...rest) {
  const fetchObj = {
    fetch: new BrowserFetch(baseUrl),
    customerCode: rest[0],
  }

  // TODO: map ic with web url.
  window.addEventListener('load', handleLoadEvent.bind(fetchObj))
  window.addEventListener('click', handleClickEvent.bind(fetchObj))
  window.addEventListener('keydown', handleKeydownEvent.bind(fetchObj))
  window.addEventListener('scroll', handleScrollEvent.bind(fetchObj))
  window.addEventListener('resize', handleResizeEvent.bind(fetchObj))
  window.addEventListener('mousemove', handleMousemoveEvent.bind(fetchObj))
}

customerCode(window.i)
