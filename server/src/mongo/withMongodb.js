import Promise from 'bluebird'
import { MongoClient } from 'mongodb'
import config from 'config'
import url from 'url'

export const connectDB = () => {
  const URL = url.format({
    slashes: true,
    protocol: config.has('mongo.protocol') ? config.get('mongo.protocol') : 'mongodb',
    hostname: config.has('mongo.host') ? config.get('mongo.host') : 'localhost',
    port: config.has('mongo.port') ? config.get('mongo.port') : 27017,
    pathname: config.has('mongo.db') ? config.get('mongo.db') : 'interact',
    // Note: mongo.auth FORMAT => String admin:pwd
    auth: config.has('mongo.auth') ? config.get('mongo.auth') : undefined,
  })
  return MongoClient.connect(URL, { promiseLibrary: Promise })
}

export default fn => async (...rest) => {
  const db = await connectDB()
  const result = await fn(db)(...rest)
  db.close.bind(db)()
  return result
}
