import * as CookieUtil from '../util/CookieUtil'

import chai from 'chai'
import config from 'config'
import crypto from 'crypto'
import sinon from 'sinon'

const expect = chai.expect

describe('CookieUtil', () => {
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

  describe('generate', () => {
    it('called with one argument', async () => {
      const timeStamp = new Date(2015, 2, 3).getTime()
      const result = await CookieUtil.generate(timeStamp)

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
      const result = await CookieUtil.generate()

      sinon.assert.calledWith(crypto.createHmac, 'sha512', secret)
      sinon.assert.calledOnce(fakeCrypto.update)
      sinon.assert.calledWith(fakeCrypto.update, timeStamp.toString())
      expect(result).to.have.string(`${timeStamp.toString()}:`)
      clock.restore()
    })

    it('called with hashedUserId as key', async () => {
      const fakeHashedUserId = '1234hashednaja'
      const result = await CookieUtil.generate(fakeHashedUserId)

      sinon.assert.calledWith(crypto.createHmac, 'sha512', secret)
      sinon.assert.calledOnce(fakeCrypto.update)
      sinon.assert.calledOnce(fakeUpdate.digest)
      sinon.assert.calledWith(fakeCrypto.update, fakeHashedUserId.toString())
      sinon.assert.calledWith(fakeUpdate.digest, 'hex')
      expect(result).to.have.string(`${fakeHashedUserId}:`)
    })
  })

  describe('validate', () => {
    it('should return true if generated cookie from key match the value', () => {
      expect(CookieUtil.validate('hello', 'hello:fakeToken')).to.be.true
    })

    it('should return false if generated cookie from key does not match the value', () => {
      expect(CookieUtil.validate('hello', 'hello:5678')).to.be.false
    })
  })
})
