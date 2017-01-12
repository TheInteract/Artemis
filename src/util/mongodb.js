const Promise = require('bluebird')
const MongoClient = require('mongodb').MongoClient
const config = require('config')
const url = require('url')

const urlObj = {
    protocol: config.get('mongo.protocol') || 'mongodb',
    hostname: config.get('mongo.host') || 'localhost',
    port: config.get('mongo.port') || 27017,
    auth: config.get('mongo.auth'),                         // mongo.auth FORMAT => String admin:pwd
}

function connectDB() {
    const URL = url.format(urlObj)
    return MongoClient.connect(URL, { promiseLibrary: Promise })
}

module.exports = { connectDB }
