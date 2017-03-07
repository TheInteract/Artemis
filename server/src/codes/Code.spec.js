import * as Code from './Code'
import * as Cookie from '../cookies/Cookie'

import InvalidArgumentError from '../errors/InvalidArgumentError'
import UnauthorizedError from '../errors/UnauthorizedError'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('Code', () => {
  describe('authorized', () => {
    const fakeCode = '12345:fakeCode'

    before(() => {
      sinon.stub(Cookie, 'validate')
      Cookie.validate.onCall(0).returns(true)
      Cookie.validate.returns(false)
    })

    after(() => {
      Cookie.validate.restore()
    })

    it('should return true when called with valid cookie', () => {
      const code = `${fakeCode}`
      assert.isTrue(Code.validate(code))
    })

    it('should throw unauthorized when called with invalid cookie', () => {
      const code = `${fakeCode}-invalid`
      assert.throws(() => { Code.authorized(code) }, UnauthorizedError)
    })

    it('should throw invalid argument when argument is undefined', () => {
      assert.throws(() => { Code.authorized() }, InvalidArgumentError)
    })
  })

  describe('validate', () => {
    const fakeKey = '12345'
    const fakeCode = `${fakeKey}:fakeCode`

    beforeEach(() => {
      sinon.stub(Cookie, 'validate')
    })

    afterEach(() => {
      Cookie.validate.restore()
    })

    it('should return true when called with valid code', () => {
      Cookie.validate.returns(true)

      const code = `${fakeCode}`
      assert.isTrue(Code.validate(code))
      assert(
        Cookie.validate.calledWithExactly(fakeKey, fakeCode),
        'invalid arguments'
      )
    })

    it('should return false when called with invalid code', () => {
      Cookie.validate.returns(false)

      const code = `${fakeCode}-invalid`
      assert.isFalse(Code.validate(code))
      assert(
        Cookie.validate.calledWithExactly(fakeKey, code),
        'invalid arguments'
      )
    })

    it('should return false when argument is undefined', () => {
      Cookie.validate.returns(false)

      assert.isFalse(Code.validate())
      assert(
        Cookie.validate.calledWithExactly('', undefined),
        'invalid arguments'
      )
    })
  })
})
