const transform = require('lodash/transform')
const get = require('lodash/get')

function pickProperties(input, properties) {
    return transform(properties, (result, value, key) => { result[key] = get(input, value) }, {})
}

module.exports = pickProperties
