import * as Collections from '../mongo/Collections'
import * as Products from './Products'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Products', () => {
  describe('getProductByPrivateKey', async () => {
    before(() => {
      sinon.stub(Collections, 'findItem')
      Collections.findItem.returns('items')
    })

    after(() => {
      Collections.findItem.restore()
    })

    const fakeApiKey = 'fakeApiKey'
    const fakeIp = 'fakeIp'

    it('should return items from Collections.findItem', async () => {
      const product = await Products.getProductByPrivateKey(fakeApiKey, fakeIp)
      assert.equal(product, 'items')
    })

    it('should called findItem with correct arguments', () => {
      assert(Collections.findItem.calledWith(
        config.mongo.collections.names.product, {
          API_KEY_PRIVATE: fakeApiKey,
          ip: fakeIp
        }
      ), 'invalid arguments')
    })
  })
})
