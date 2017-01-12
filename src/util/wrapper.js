import Promise from 'bluebird'
import mongodb from './mongodb'

const wrapper = fn => async (...rest) => {
    const db = await mongodb.connectDB()
    const fnPromise = Promise.method((...args) => Promise.try(() => fn.bind(db)(...args)))

    const result = await fnPromise(...rest)
    db.close.bind(db)()
    return result
}

module.exports = { wrapper }
