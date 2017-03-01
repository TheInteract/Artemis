import * as Collections from '../mongo/Collections'
import * as Products from './Products'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Products', () => {
  before(() => {
    sinon.stub(Collections, 'findItem')
    Collections.findItem.returns('items')
  })

  after(() => {
    Collections.findItem.restore()
  })

  describe('getProductByPrivateKey', async () => {
    const fakePrivateApiKey = 'fakePrivateApiKey'
    const fakeIp = 'fakeIp'

    it('should return items from Collections.findItem', async () => {
      const product = await Products.getProductByPrivateKey(
        fakePrivateApiKey,
        fakeIp
      )
      assert.equal(product, 'items')
    })

    it('should called findItem with correct arguments', () => {
      assert(Collections.findItem.calledWith(
        config.mongo.collections.names.product, {
          API_KEY_PRIVATE: fakePrivateApiKey,
          ip: fakeIp
        }
      ), 'invalid arguments')
    })
  })

  describe('getProductByPublicKey', async () => {
    const fakePublicApiKey = 'fakePublicApiKey'
    const fakeDomainName = 'fakeDomainName'

    it('should return items from Collections.findItem', async () => {
      const product = await Products.getProductByPublicKey(
        fakePublicApiKey,
        fakeDomainName
      )
      assert.equal(product, 'items')
    })

    it('should called findItem with correct arguments', () => {
      assert(Collections.findItem.calledWith(
        config.mongo.collections.names.product, {
          API_KEY_PUBLIC: fakePublicApiKey,
          domainName: fakeDomainName
        }
      ), 'invalid arguments')
    })
  })
})
