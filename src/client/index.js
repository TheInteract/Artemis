(() => {
    const BrowserFetch = require('../util/fetch')
    const once = require('lodash/once')

    const handleLoadEvent = require('./events/load')

    const setupFetch = once(() => {
        const baseUrl = 'http://localhost:3000/api'
        return {
            fetch: new BrowserFetch(baseUrl),
        }
    })

    function tracking() {
        window.addEventListener('load', handleLoadEvent.bind(setupFetch()))
    }

    tracking(window)
})()
