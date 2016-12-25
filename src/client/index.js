const BrowserFetch = require('../util/fetch')
const handleLoadEvent = require('./events/load')
const handleClickEvent = require('./events/click')
const handleKeydownEvent = require('./events/keydown')
const handleScrollEvent = require('./events/scroll')
const handleResizeEvent = require('./events/resize')

const baseUrl = 'http://localhost:3000/'

function ic(...rest) {
    const fetchObj = {
        fetch: new BrowserFetch(baseUrl),
        uid: rest[0],
    }
    // TODO: map uid with web url.
    window.addEventListener('load', handleLoadEvent.bind(fetchObj))
    window.addEventListener('click', handleClickEvent.bind(fetchObj))
    window.addEventListener('keydown', handleKeydownEvent.bind(fetchObj))
    window.addEventListener('scroll', handleScrollEvent.bind(fetchObj))
    window.addEventListener('resize', handleResizeEvent.bind(fetchObj))
}
ic(window.i)
