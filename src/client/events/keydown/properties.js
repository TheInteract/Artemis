const { select } = require('optimal-select')

const properties = {
    code: 'code',
    target: { target: 'target', fn: select },
    timeStamp: 'timeStamp',
}

module.exports = properties
