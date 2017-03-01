import * as Collections from '../mongo/Collections'
import * as Products from './Products'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Products', () => {
  describe('getProduct', async () => {
    before(() => {
      sinon.stub(Collections, 'findItem')
      Collections.findItem.returns('items')
    })

    after(() => {
      Collections.findItem.restore()
    })

    const fakeApiKey = 'API_KEY'
    const fakeHostname = 'fakeHostname'

    it('should return items from Collections.findItem', async () => {
      const product = await Products.getProduct(fakeApiKey, fakeHostname)
      assert.equal(product, 'items')
    })

    it('should called findItem with correct arguments', () => {
      assert(Collections.findItem.calledWith(
        config.mongo.collections.names.product, {
          API_KEY: fakeApiKey,
          hostname: fakeHostname
        }
      ), 'invalid arguments')
    })
  })
})
