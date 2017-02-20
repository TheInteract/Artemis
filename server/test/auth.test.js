const chai = require('chai')
const sinon = require('sinon')
const auth = require('../util/auth')
const token = require('../util/token')
const mongodb = require('../util/mongodb')
const { wrapper } = require('../util/wrapper')
const UnauthorizedError = require('../errors/unauthorized')
const InvalidArgumentError = require('../errors/invalid-argument')

const expect = chai.expect

describe('authorized()', () => {
  const fakeToken = '12345:fakeToken'
  before(() => {
    sinon.stub(token, 'generateToken')
    token.generateToken.returns(fakeToken)
  })
  after(() => {
    token.generateToken.restore()
  })
  it('called with valid argument', async () => {
    const cookie = `${fakeToken}`
    const result = await auth.authorized(cookie)
    expect(result).to.be.true
  })
  it('called with invalid argument', async () => {
    const cookie = `${fakeToken}-invalid`
    try {
      await auth.authorized(cookie)
    } catch (e) {
      expect(e).be.instanceOf(UnauthorizedError)
    }
  })
  it('called with undefined argument', async () => {
    try {
      await auth.authorized()
    } catch (e) {
      expect(e).be.instanceOf(InvalidArgumentError)
    }
  })
})

describe('identify()', () => {
  before(() => {
    sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => null }), close: () => {} })
    sinon.stub(mongodb, 'connectDB').onCall(3).returns({ collection: () => ({ findOne: () => true }), close: () => {} })
  })
  after(() => {
    mongodb.connectDB.restore()
  })
  it('called without argument', async () => {
    try {
      await wrapper(auth.identify)()
    } catch (e) {
      expect(e).to.be.instanceOf(InvalidArgumentError)
    }
  })
  it('called with invalid uuid and hostname', async () => {
    try {
      await wrapper(auth.identify)('test', 'test')
    } catch (e) {
      expect(e).to.be.instanceOf(UnauthorizedError)
    }
  })
  it('called with valid uuid and hostname', async () => {
    const result = await wrapper(auth.identify)('test', 'test')
    mongodb.connectDB.restore()
    expect(result).to.be.true
  })
})
