const optimalSelect = require('optimal-select')

function modifiedSelect (element) {
  return optimalSelect.select(element, {
    priority: [ 'interact-click', 'id' ],
    ignore: {
      attribute (name, value, defaultPredicate) {
        return !(/interact-*/).test(name) && !(/id/).test(name)
      }
    }
  })
}

const properties = {
  target: { target: 'target', fn: modifiedSelect },
  timeStamp: 'timeStamp',
}

module.exports = properties
