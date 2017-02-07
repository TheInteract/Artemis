const transform = require('lodash/transform')
const get = require('lodash/get')

function pickProperties (input, properties) {
  return transform(properties, (result, value, key) => {
    const v = get(input, value.target || value)
    if (value.fn && typeof value.fn === 'function') {
      result[key] = value.fn(v)
    } else {
      result[key] = v
    }
  }, {})
}

module.exports = pickProperties
