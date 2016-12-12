const PROPERTIES = require('./properties')
const get = require('lodash/get')
const transform = require('lodash/transform')

function handleLoadEvent(e) {
    console.log(e)
    const data = transform(PROPERTIES, (result, value, key) => { result[key] = get(e, value) }, {})
    console.log(`data`, data)
    this.fetch
        .post('/event/load', { test: '1' })
        .then(r => console.log(r))
}

module.exports = handleLoadEvent
