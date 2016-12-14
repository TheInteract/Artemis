const PROPERTIES = require('./properties')
const get = require('lodash/get')
const transform = require('lodash/transform')

function handleLoadEvent(e) {
    const data = transform(PROPERTIES, (result, value, key) => { result[key] = get(e, value) }, {})
    data.uid = this.uid
    this.fetch.post('/event/load', data)
}

module.exports = handleLoadEvent
