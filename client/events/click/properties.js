const optimalSelect = require('optimal-select')

function modifiedSelect (element) {
  return optimalSelect.select(element, {
    skip (traverseNode) {
      // ignore select information of the direct parent
      return traverseNode === element.parentNode
    },
    priority: [ 'id', 'class', 'href', 'src' ],
    ignore: {
      attribute (name, value, defaultPredicate) {
        // exclude HTML5 data attributes
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
