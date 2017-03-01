const chai = require('chai')
const sinon = require('sinon')
const auth = require('../util/AuthUtility')
const mongodb = require('../util/mongodb')
const { generate } = require('../util/CookieUtil')
const initUtil = require('../util/init/initUtility')
const UnauthorizedError = require('../errors/unauthorized')
const addFunction = require('../util/init/featureManipulator')
const InvalidArgumentError = require('../errors/invalid-argument')

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
      const validCookie = generate()
      const result = await initUtil.setupCookie(validCookie)
      expect(result).to.be.equal(validCookie)
    })
  })

  describe('handleUserOnInit()', () => {
    it('Should return error if input with invalid argument', async () => {
      sinon.stub(mongodb, 'connectDB').returns({
        collection: () => ({
          findOne: () => null
        }),
        close: () => {}
      })
      try {
        await initUtil.handleUserOnInit(undefined, undefined, 'test', 'test')
      } catch (e) {
        expect(e).to.be.instanceOf(InvalidArgumentError)
      } finally {
        mongodb.connectDB.restore()
      }
    })
    it('Should return error if user and customer record are not found', async () => {
      sinon.stub(mongodb, 'connectDB').returns({
        collection: () => ({
          findOne: () => null
        }),
        close: () => {}
      })
      try {
        await initUtil.handleUserOnInit('test', 'test', 'test', 'test')
      } catch (e) {
        expect(e).to.be.instanceOf(UnauthorizedError)
      } finally {
        mongodb.connectDB.restore()
      }
    })
    it('Should return user if user record is found', async () => {
      const mockObject = {
        ops: [ true ]
      }
      let mockCustomer = {
        'API_KEY': 'IC9-55938-5',
        'hostname': 'localhost',
        'features': [
          {
            'name': 'card-1',
            'versions': [
              {
                'version': 'A',
                'percent': 0
              },
              {
                'version': 'B',
                'percent': 0
              }
            ]
          },
          {
            'name': 'card-2',
            'versions': [
              {
                'version': 'A',
                'percent': 0
              },
              {
                'version': 'B',
                'percent': 0
              }
            ]
          }
        ]
      }
      const tempStub = sinon.stub(mongodb, 'connectDB')
      tempStub.onCall(0).returns({
        collection: () => ({
          findOne: () => mockObject
        }),
        close: () => {}
      })
      tempStub.onCall(1).returns({
        collection: () => ({
          findOne: () => mockCustomer
        }),
        close: () => {}
      })
      tempStub.returns({
        collection: () => ({
          count: () => 1
        }),
        close: () => {}
      })
      sinon.stub(addFunction, 'syncFeatureList').returns(mockObject)
      try {
        const result = await initUtil.handleUserOnInit('test', 'test', 'test', 'test')
        expect(result).to.be.equal(mockObject)
      } catch (e) {
        throw e
      } finally {
        mongodb.connectDB.restore()
        addFunction.syncFeatureList.restore()
      }
    })
    it('Should return user if input new user and valid customer', async () => {
      const tempStub = sinon.stub(mongodb, 'connectDB')
      let mockCustomer = {
        'API_KEY': 'IC9-55938-5',
        'hostname': 'localhost',
        'features': [
          {
            'name': 'card-1',
            'versions': [
              {
                'version': 'A',
                'percent': 0
              },
              {
                'version': 'B',
                'percent': 0
              }
            ]
          },
          {
            'name': 'card-2',
            'versions': [
              {
                'version': 'A',
                'percent': 0
              },
              {
                'version': 'B',
                'percent': 0
              }
            ]
          }
        ]
      }
      let mockNewUser = {
        'ops': [ 'test' ]
      }
      tempStub.onCall(0).returns({
        collection: () => ({
          findOne: () => null
        }),
        close: () => {}
      })
      tempStub.onCall(1).returns({
        collection: () => ({
          findOne: () => mockCustomer
        }),
        close: () => {}
      })
      tempStub.returns({
        collection: () => ({
          insert: () => mockNewUser,
          count: () => 1
        }),
        close: () => {}
      })
      try {
        const result = await initUtil.handleUserOnInit('test', 'test', 'test', 'test')
        expect(result).to.be.equal('test')
      } catch (e) {
        throw e
      } finally {
        mongodb.connectDB.restore()
      }
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
      let featureList = [
        {
          'name': 'card-1',
          'versions': [
            {
              'version': 'A',
              'percent': 0,
              'count': 5
            },
            {
              'version': 'B',
              'percent': 0,
              'count': 4
            }
          ]
        },
        {
          'name': 'card-2',
          'versions': [
            {
              'version': 'A',
              'percent': 0,
              'count': 0
            },
            {
              'version': 'B',
              'percent': 0,
              'count': 1
            }
          ]
        }
      ]
      await initUtil.sortFeatureByCount(featureList)
      const result = (featureList[0].versions[0].version === 'B' && featureList[1].versions[0].version === 'A')
      expect(result).to.be.true
    })
  })

  // Move to be the integration test
  // describe('init()', () => {
  //   before(() => {
  //     let mockUser = {'uid': '1487135983512:e0b8f93c88dafdc7a7933542fe7d2e33be54788bfb8ba9df739ecf9e2097643a7ff6c13ac0cea8c9961f4afa3be4efcf4750464a32ebcaadc8242971776f43d6a', 'API_KEY': 'IC9-55938-5', 'hostname': 'localhost', 'features': [ {'name': 'card-1', 'version': 'A'}, {'name': 'card-2', 'version': 'A'} ]}
  //     sinon.stub(initUtil, 'handleUserOnInit').returns(Promise.resolve(mockUser))
  //   })
  //   after(() => {
  //     initUtil.handleUserOnInit.restore()
  //   })
  //   it('Should return cookie if put in nothing', async () => {
  //     let mockContext = {}
  //     initEvent(mockContext)
  //     expect(mockContext.body).to.be.not.undefined
  //   })
  // })
})
