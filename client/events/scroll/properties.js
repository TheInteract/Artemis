const { select } = require('optimal-select')

const properties = {
  scrollTop: 'target.scrollingElement.scrollTop',
  target: { target: 'target', fn: select },
  timeStamp: 'timeStamp',
}

module.exports = properties
