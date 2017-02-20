const chai = require('chai')
const sinon = require('sinon')
const auth = require('../util/auth')
const init = require('../events/init')
const mongodb = require('../util/mongodb')
const InvalidArgumentError = require('../errors/invalid-argument')
const UnauthorizedError = require('../errors/unauthorized')
const { setupCookie, handleCustomerOnload, sortFeatureByCount } = require('../util/init-util')

const expect = chai.expect

describe('Init unit testing', () => {
  describe('setupCookie()', () => {
    it('Should return a new valid cookie if input no cookie', async () => {
      const cookie = await setupCookie()
      const result = await auth.authorized(cookie)
      expect(result).to.be.true
    })
    it('Should return a new valid cookie if input invalid cookie', async () => {
      const cookie = await setupCookie('test')
      const result = await auth.authorized(cookie)
      expect(result).to.be.true
    })
    it('Should return the same cookie if input with valid cookie', async () => {
      const validCookie = '1487319440330:9089993180c59c70b1256dac5f9e12563c78e6c9c6a804126796d1acf2149b39634d474f8a52a321a019f6cf1b5e6e5c8fd1cfe7afe5e3b6f3321c4f1afb848d'
      const result = await setupCookie(validCookie)
      expect(result).to.be.equal(validCookie)
    })
  })

  describe('handleCustomerOnload()', () => {
    it('Should return error if input with invalid argument', async () => {
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => null }), close: () => {} })
      try {
        await handleCustomerOnload(undefined, undefined, 'test', 'test')
      } catch (e) {
        expect(e).to.be.instanceOf(InvalidArgumentError)
      } finally {
        mongodb.connectDB.restore()
      }
    })
    it('Should return user if user record is found', async () => {
      const mockObject = { 'test': 'test' }
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => mockObject }), close: () => {} })
      const result = await handleCustomerOnload('test', 'test', 'test', 'test')
      mongodb.connectDB.restore()
      expect(result).to.be.equal(mockObject)
    })
    it('Should return error if user and customer record is not found', async () => {
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => null }), close: () => {} })
      try {
        await handleCustomerOnload('test', 'test', 'test', 'test')
      } catch (e) {
        expect(e).to.be.instanceOf(UnauthorizedError)
      } finally {
        mongodb.connectDB.restore()
      }
    })
  })

  describe('sortFeatureByCount()', () => {
    it('Should return error if feature is in wrong format', async () => {
      try {
        var featureList = [ ]
        await sortFeatureByCount(featureList)
      } catch (e) {
        expect(e).to.be.instanceOf(InvalidArgumentError)
      }
    })
    it('Should return sorted feature count is input valid feature', async () => {
      var featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0, 'count': 5}, {'version': 'B', 'percent': 0, 'count': 4} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0, 'count': 0}, {'version': 'B', 'percent': 0, 'count': 1} ]} ]
      await sortFeatureByCount(featureList)
      var result = false
      if (featureList[0].versions[0].version === 'B' && featureList[1].versions[0].version === 'A') result = true
      expect(result).to.be.true
    })
  })
})
