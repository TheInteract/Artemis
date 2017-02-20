const chai = require('chai')
const sinon = require('sinon')
const auth = require('../util/auth')
const { initEvent } = require('../events/init')
const mongodb = require('../util/mongodb')
const InvalidArgumentError = require('../errors/invalid-argument')
const UnauthorizedError = require('../errors/unauthorized')
const initUtil = require('../util/init-utility')

const expect = chai.expect

describe('Init unit testing', () => {
  describe('setupCookie()', () => {
    it('Should return a new valid cookie if input no cookie', async () => {
      const cookie = await initUtil.setupCookie()
      const result = await auth.authorized(cookie)
      expect(result).to.be.true
    })
    it('Should return a new valid cookie if input invalid cookie', async () => {
      const cookie = await initUtil.setupCookie('test')
      const result = await auth.authorized(cookie)
      expect(result).to.be.true
    })
    it('Should return the same cookie if input with valid cookie', async () => {
      const validCookie = '1487319440330:9089993180c59c70b1256dac5f9e12563c78e6c9c6a804126796d1acf2149b39634d474f8a52a321a019f6cf1b5e6e5c8fd1cfe7afe5e3b6f3321c4f1afb848d'
      const result = await initUtil.setupCookie(validCookie)
      expect(result).to.be.equal(validCookie)
    })
  })

  describe('handleCustomerOnload()', () => {
    it('Should return error if input with invalid argument', async () => {
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => null }), close: () => {} })
      try {
        await initUtil.handleCustomerOnload(undefined, undefined, 'test', 'test')
      } catch (e) {
        expect(e).to.be.instanceOf(InvalidArgumentError)
      } finally {
        mongodb.connectDB.restore()
      }
    })
    it('Should return user if user record is found', async () => {
      const mockObject = { 'test': 'test' }
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => mockObject }), close: () => {} })
      const result = await initUtil.handleCustomerOnload('test', 'test', 'test', 'test')
      mongodb.connectDB.restore()
      expect(result).to.be.equal(mockObject)
    })
    it('Should return error if user and customer record are not found', async () => {
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => null }), close: () => {} })
      try {
        await initUtil.handleCustomerOnload('test', 'test', 'test', 'test')
      } catch (e) {
        expect(e).to.be.instanceOf(UnauthorizedError)
      } finally {
        mongodb.connectDB.restore()
      }
    })
    it('Should return user if input new user and valid customer', async () => {
      const tempStub = sinon.stub(mongodb, 'connectDB')
      let mockCustomer = {'customerCode': 'IC9-55938-5', 'hostname': 'localhost', 'features': [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]} ]}
      let mockNewUser = {'ops': [ 'test' ]}
      tempStub.onCall(0).returns({ collection: () => ({ findOne: () => null }), close: () => {} })
      tempStub.onCall(1).returns({ collection: () => ({ findOne: () => mockCustomer }), close: () => {} })
      tempStub.returns({ collection: () => ({ insert: () => mockNewUser, count: () => 1 }), close: () => {} })
      const result = await initUtil.handleCustomerOnload('test', 'test', 'test', 'test')
      mongodb.connectDB.restore()
      expect(result).to.be.equal('test')
    })
  })

  describe('sortFeatureByCount()', () => {
    it('Should return error if feature is in wrong format', async () => {
      try {
        let featureList = []
        await initUtil.sortFeatureByCount(featureList)
      } catch (e) {
        expect(e).to.be.instanceOf(InvalidArgumentError)
      }
    })
    it('Should return sorted feature count is input valid feature', async () => {
      let featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0, 'count': 5}, {'version': 'B', 'percent': 0, 'count': 4} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0, 'count': 0}, {'version': 'B', 'percent': 0, 'count': 1} ]} ]
      await initUtil.sortFeatureByCount(featureList)
      let result = false
      if (featureList[0].versions[0].version === 'B' && featureList[1].versions[0].version === 'A') result = true
      expect(result).to.be.true
    })
  })

  describe('init()', () => {
    const mockContext = {}
    before(() => {
      let mockUser = {'uid': '1487135983512:e0b8f93c88dafdc7a7933542fe7d2e33be54788bfb8ba9df739ecf9e2097643a7ff6c13ac0cea8c9961f4afa3be4efcf4750464a32ebcaadc8242971776f43d6a', 'customerCode': 'IC9-55938-5', 'hostname': 'localhost', 'features': [ {'name': 'card-1', 'version': 'A'}, {'name': 'card-2', 'version': 'A'} ]}
      sinon.stub(initUtil, 'handleCustomerOnload').returns(mockUser)
    })
    after(() => {
      initUtil.handleCustomerOnload.restore()
    })
    it('Should return error if feature is in wrong format', async () => {
    })
  })
})
