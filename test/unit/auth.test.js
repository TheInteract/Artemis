const chai = require('chai')
const sinon = require('sinon')
const auth = require('../../src/util/auth')
const token = require('../../src/util/token')
const UnauthorizedError = require('../../src/errors/unauthorized')

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
            expect(e).be.instanceOf(UnauthorizedError)
        }
    })
})
