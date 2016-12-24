const { select } = require('optimal-select')

const properties = {
    target: { target: 'target', fn: select },
    timeStamp: 'timeStamp',
}

module.exports = properties
