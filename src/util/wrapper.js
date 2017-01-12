const mongodb = require('./mongodb')

const wrapper = fn => async (...rest) => {
    const db = await mongodb.connectDB()
    const result = await fn.call(db, ...rest)
    db.close.bind(db)()
    return result
}

module.exports = { wrapper }
