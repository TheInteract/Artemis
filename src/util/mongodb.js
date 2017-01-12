const Promise = require('bluebird')
const MongoClient = require('mongodb').MongoClient
const config = require('config')
const url = require('url')

const urlObj = {
    slashes: true,
    protocol: config.has('mongo.protocol') ? config.get('mongo.protocol') : 'mongodb',
    hostname: config.has('mongo.host') ? config.get('mongo.host') : 'localhost',
    port: config.has('mongo.port') ? config.get('mongo.port') : 27017,
    pathname: config.has('mongo.db') ? config.get('mongo.db') : 'interact',
    auth: config.has('mongo.auth') ? config.get('mongo.auth') : undefined, // mongo.auth FORMAT => String admin:pwd
}

function connectDB() {
    const URL = url.format(urlObj)
    return MongoClient.connect(URL, { promiseLibrary: Promise })
}

module.exports = { connectDB }
