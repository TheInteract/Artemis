(() => {
    const BrowserFetch = require('./util/fetch')
    const once = require('lodash/once')

    const handleLoadEvent = require('./events/load')

    function tracking() {
        window.addEventListener('load', handleLoadEvent)
    }

    tracking(window)
})()
