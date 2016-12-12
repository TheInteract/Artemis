const BrowserFetch = require('../util/fetch')
const handleLoadEvent = require('./events/load')

const baseUrl = 'http://localhost:3000/'
const fetchObj = {
    fetch: new BrowserFetch(baseUrl),
}

function tracking() {
    window.addEventListener('load', handleLoadEvent.bind(fetchObj))
}

tracking(window)
