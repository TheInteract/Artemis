const chai = require('chai')
const sinon = require('sinon')
const utility = require('../util/mongo-utility')
const mongodb = require('../util/mongodb')
const { wrapper } = require('../util/wrapper')
const InvalidArgumentError = require('../errors/invalid-argument')

const expect = chai.expect

describe('Mongo utility', () => {
  describe('getUID()', () => {
    describe('Input validation', () => {
      before(() => {
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => true }), close: () => {} })
      })
      after(() => {
        mongodb.connectDB.restore()
      })
      it('should return a user when called with a valid argument (both uid and cookie)', async () => {
        const result = await wrapper(utility.getUID)('this is uid', 'this is cookie', 'code', 'host')
        expect(result).to.be.true
      })
      it('should return a user when called with a valid argument (only uid)', async () => {
        const result = await wrapper(utility.getUID)('this is uid', undefined, 'code', 'host')
        expect(result).to.be.true
      })
      it('should return a user when called with a valid argument (only cookie)', async () => {
        const result = await wrapper(utility.getUID)(undefined, 'this is cookie', 'code', 'host')
        expect(result).to.be.true
      })
      it('should throw error when called with invalid argument', async () => {
        try {
          await wrapper(utility.getUID)('this is uid', 'this is cookie', undefined, 'host')
        } catch (e) {
          expect(e).to.be.instanceOf(InvalidArgumentError)
        }
      })
    })

    describe('Output validation', () => {
      afterEach(() => {
        mongodb.connectDB.restore()
      })
      it('should return a user when called with a valid record', async () => {
        const mockObject = { 'test': 'test' }
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => mockObject }), close: () => {} })
        const result = await wrapper(utility.getUID)('this is uid', 'this is cookie', 'code', 'host')
        expect(result).to.be.an('object')
      })
      it('should return undefined when called with invalid record', async () => {
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => null }), close: () => {} })
        const result = await wrapper(utility.getUID)('this is uid', undefined, 'code', 'host')
        expect(result).to.be.undefined
      })
    })
  })

  describe('getCustomer()', () => {
    describe('Input validation', () => {
      before(() => {
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => true }), close: () => {} })
      })
      after(() => {
        mongodb.connectDB.restore()
      })
      it('should return a customer when called with a valid argument', async () => {
        const result = await wrapper(utility.getCustomer)('customer', 'host')
        expect(result).to.be.true
      })
      it('should throw error when called with invalid argument', async () => {
        try {
          await wrapper(utility.getCustomer)('customer', undefined)
        } catch (e) {
          expect(e).to.be.instanceOf(InvalidArgumentError)
        }
      })
    })

    describe('Output validation', () => {
      afterEach(() => {
        mongodb.connectDB.restore()
      })
      it('should return a customer when called with a valid record', async () => {
        const mockObject = { 'test': 'test' }
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => mockObject }), close: () => {} })
        const result = await wrapper(utility.getCustomer)('customer', 'host')
        expect(result).to.be.an('object')
      })
      it('should return undefined when called with invalid record', async () => {
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => null }), close: () => {} })
        try {
          await wrapper(utility.getCustomer)('customer', 'test')
        } catch (e) {
          expect(e).to.be.undefined
        }
      })
    })
  })

  describe('getFeatureUniqueCount()', () => {
    before(() => {
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ count: () => 4 }), close: () => {} })
    })
    after(() => {
      mongodb.connectDB.restore()
    })
    it('should return a feature count equal to four when called with valid argument', async () => {
      let featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]} ]
      let result = true
      await wrapper(utility.getFeatureUniqueCount)('customer', 'host', featureList)
      for (let feature of featureList) {
        for (let version of feature.versions) {
          if (!version.count || version.count !== 4) {
            result = false
          }
        }
      }
      expect(result).to.be.true
    })
    it('should throw error when called with invalid argument', async () => {
      try {
        await wrapper(utility.getFeatureUniqueCount)('customer', 'host', undefined)
      } catch (e) {
        expect(e).to.be.instanceOf(InvalidArgumentError)
      }
    })
    it('should throw error when called with invalid feature format', async () => {
      try {
        await wrapper(utility.getFeatureUniqueCount)('customer', 'host', [ 'test' ])
      } catch (e) {
        expect(e).to.be.instanceOf(InvalidArgumentError)
      }
    })
  })

  describe('insertNewUser()', () => {
    describe('Input validation', () => {
      before(() => {
        const mockInsert = {ops: [ true ]}
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ insert: () => mockInsert }), close: () => {} })
      })
      after(() => {
        mongodb.connectDB.restore()
      })
      it('should return error when called with a invalid feature format', async () => {
        try {
          await wrapper(utility.insertNewUser)('this is uid', 'this is cookie', 'code', 'host', [ 'test' ])
        } catch (e) {
          expect(e).to.be.instanceOf(InvalidArgumentError)
        }
      })
      it('should return a user when called with a valid argument (both uid and cookie)', async () => {
        let featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]} ]
        const result = await wrapper(utility.insertNewUser)('this is uid', 'this is cookie', 'code', 'host', featureList)
        expect(result).to.be.true
      })
      it('should return a user when called with a valid argument (only uid)', async () => {
        let featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]} ]
        const result = await wrapper(utility.insertNewUser)('this is uid', undefined, 'code', 'host', featureList)
        expect(result).to.be.true
      })
      it('should return a user when called with a valid argument (only cookie)', async () => {
        let featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]} ]
        const result = await wrapper(utility.insertNewUser)(undefined, 'this is cookie', 'code', 'host', featureList)
        expect(result).to.be.true
      })
      it('should throw error when called with invalid argument', async () => {
        try {
          let featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]} ]
          await wrapper(utility.insertNewUser)('this is uid', 'this is cookie', undefined, 'host', featureList)
        } catch (e) {
          expect(e).to.be.instanceOf(InvalidArgumentError)
        }
      })
    })

    describe('Output validation', () => {
      afterEach(() => {
        mongodb.connectDB.restore()
      })
      it('should return a user when called with a valid record', async () => {
        const mockObject = { ops: [ true ] }
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ insert: () => mockObject }), close: () => {} })
        let featureList = [ {'name': 'card-1', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]}, {'name': 'card-2', 'versions': [ {'version': 'A', 'percent': 0}, {'version': 'B', 'percent': 0} ]} ]
        const result = await wrapper(utility.insertNewUser)('this is uid', 'this is cookie', 'code', 'host', featureList)
        expect(result).to.be.true
      })
      it('should return undefined when called with a invalid record', async () => {
        sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ insert: () => null }), close: () => {} })
        const result = await await wrapper(utility.insertNewUser)('this is uid', 'this is cookie', 'code', 'host', [])
        expect(result).to.be.undefined
      })
    })
  })
})
