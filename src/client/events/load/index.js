const PROPERTIES = require('./properties')
const { get, transform } = require('lodash')

async function handleLoadEvent(e) {
    console.log(e)
    const data = transform(PROPERTIES, (result, value, key) => { result[key] = get(e, value) }, {})
    console.log(`data`, data)
    const result = await this.fetch.post('/event/load', { test: '1' })
    console.log(result)
}

module.exports = handleLoadEvent
