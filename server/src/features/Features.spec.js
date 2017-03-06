import * as Collections from '../mongo/Collections'
import * as Features from './Features'

import Mongodb from 'mongodb'
import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Features', () => {
  const mockFeatures = [ 'hello', 'it\'s me' ]
  const fakeProductId = 'fakeProductId'

  before(() => {
    sinon.stub(Mongodb, 'ObjectId')
    Mongodb.ObjectId.returnsArg(0)
    sinon.stub(Collections, 'findItems')
    Collections.findItems.returns(mockFeatures)
  })

  after(() => {
    Mongodb.ObjectId.restore()
    Collections.findItems.restore()
  })

  describe('getFeaturesByProduct', () => {
    it('should return item from Collections.findItems', async () => {
      const features = await Features.getFeaturesByProduct(fakeProductId)
      assert.deepEqual(features, mockFeatures)
    })

    it('should called Mongodb.ObjectId with correct productId', () => {
      assert(Mongodb.ObjectId.calledWithExactly(
        fakeProductId
      ), 'invalid arguments')
    })

    it('should called findItems with correct arguments', () => {
      assert(Collections.findItems.calledWithExactly(
        config.mongo.collections.names.feature, {
          productId: fakeProductId
        }
      ), 'invalid arguments')
    })
  })
})
