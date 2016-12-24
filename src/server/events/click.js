const omit = require('lodash/omit')
const store = require('../../util/store')

const handleEvent = async (cookie, body) => {
    const { uid } = body
    const rest = omit(body, ['uid'])
    await store.save(uid, cookie, rest, 'click')
}

module.exports = { handleEvent }
