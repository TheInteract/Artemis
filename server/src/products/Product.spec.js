import * as Product from './Product'
import * as Products from './Products'

import UnauthorizedError from '../errors/UnauthorizedError'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('Product', () => {
  describe('authorized', () => {
    let stubCtx
    let stubNext

    before(() => {
      sinon.stub(Products, 'getProduct')
      Products.getProduct.onCall(0).returns(null)
      Products.getProduct.onCall(1).returns({})
    })

    beforeEach(() => {
      stubCtx = sinon.stub({
        request: {
          ip: 'fakeIp',
          body: { API_KEY: 'fakeApiKey' }
        },
        throw: () => {}
      })

      stubNext = sinon.stub()
    })

    after(() => {
      Products.getProduct.restore()
    })

    it('should throw error in ctx if API_KEY and hostname does not match', async () => {
      await Product.authorized(stubCtx, stubNext)
      const e = new UnauthorizedError()
      assert(stubCtx.throw.calledWith(e.message, e.status), 'invalid arguments')
      assert(stubNext.notCalled, 'next should not be called if product is not valid')
    })

    it('should call next if API_KEY matches with hostname', async () => {
      await Product.authorized(stubCtx, stubNext)
      assert(stubCtx.throw.notCalled, 'should not throw if product is valid')
      assert(stubNext.calledOnce, 'next should be called if product is valid')
    })
  })
})
