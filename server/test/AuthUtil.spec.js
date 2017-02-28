import chai from 'chai'
import sinon from 'sinon'
import * as AuthUtil from '../util/AuthUtil'
import * as CookieUtil from '../util/CookieUtil'
import UnauthorizedError from '../errors/unauthorized'
import InvalidArgumentError from '../errors/invalid-argument'

const expect = chai.expect

describe('AuthUtil', () => {
  describe('authorized', () => {
    const fakeToken = '12345:fakeToken'

    before(() => {
      sinon.stub(CookieUtil, 'validate')
      CookieUtil.validate.onCall(0).returns(true)
      CookieUtil.validate.returns(false)
    })

    after(() => {
      CookieUtil.validate.restore()
    })

    it('called with valid cookie', () => {
      const cookie = `${fakeToken}`
      const result = AuthUtil.authorized(cookie)
      expect(result).to.be.true
    })

    it('called with invalid cookie', () => {
      const cookie = `${fakeToken}-invalid`
      expect(() => { AuthUtil.authorized(cookie) }).to.throw(UnauthorizedError)
    })

    it('called with undefined argument', () => {
      expect(() => { AuthUtil.authorized() }).to.throw(InvalidArgumentError)
    })
  })
})
