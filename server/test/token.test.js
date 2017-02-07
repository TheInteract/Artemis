const chai = require('chai')
const sinon = require('sinon')
const crypto = require('crypto')
const config = require('config')
const token = require('../util/token')

const expect = chai.expect

describe('generateToken()', () => {
  const fakeUpdate = { digest: sinon.stub() }
  const fakeCrypto = { update: sinon.stub() }
  const secret = config.get('secret.key')

  beforeEach(() => {
    sinon.stub(crypto, 'createHmac')
    crypto.createHmac.returns(fakeCrypto)
    fakeCrypto.update.returns(fakeUpdate)
    fakeUpdate.digest.returns('fakeToken')
  })
  afterEach(() => {
    crypto.createHmac.restore()
    fakeCrypto.update.reset()
    fakeUpdate.digest.reset()
  })
  it('called with one argument', async () => {
    const timeStamp = new Date(2015, 2, 3).getTime()
    const result = await token.generateToken(timeStamp)

    sinon.assert.calledWith(crypto.createHmac, 'sha512', secret)
    sinon.assert.calledOnce(fakeCrypto.update)
    sinon.assert.calledOnce(fakeUpdate.digest)
    sinon.assert.calledWith(fakeCrypto.update, timeStamp.toString())
    sinon.assert.calledWith(fakeUpdate.digest, 'hex')
    expect(result).to.have.string(`${timeStamp}:`)
  })
  it('called with empty argument', async () => {
    const timeStamp = new Date().getTime()
    const clock = sinon.useFakeTimers(timeStamp)
    const result = await token.generateToken()

    sinon.assert.calledWith(crypto.createHmac, 'sha512', secret)
    sinon.assert.calledOnce(fakeCrypto.update)
    sinon.assert.calledWith(fakeCrypto.update, timeStamp.toString())
    expect(result).to.have.string(`${timeStamp.toString()}:`)
    clock.restore()
  })
})
