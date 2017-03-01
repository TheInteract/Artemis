import * as Collections from '../mongo/Collections'
import * as FeatureLists from './FeatureLists'

import Mongodb from 'mongodb'
import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('FeatureLists', () => {
  describe('getFeatureList', () => {
    const fakeFeatureListId = 'fakeFeatureListId-1'
    const fakeProductId = 'fakeProductId-1'
    const fakeFeatures = [
      { name: 'fakeName-1', version: 'fakeVersion-1' },
      { name: 'fakeName-2', version: 'fakeVersion-2' }
    ]

    const mockUser = {
      featureLists: [
        { featureListId: fakeFeatureListId, productId: fakeProductId },
        { featureListId: 'fakeFeatureListId-2', productId: 'fakeProductId-2' },
      ]
    }
    const mockProduct = { _id: fakeProductId }

    before(() => {
      sinon.stub(Mongodb, 'ObjectId')
      Mongodb.ObjectId.returnsArg(0)
      sinon.stub(Collections, 'findItem')
      Collections.findItem.onCall(0).returns({
        _id: fakeFeatureListId,
        features: fakeFeatures
      })
      Collections.findItem.onCall(1).returns(null)
    })

    after(() => {
      Mongodb.ObjectId.restore()
      Collections.findItem.restore()
    })

    it('should return array of features if user has feature list in this product', async () => {
      const features = await FeatureLists.getFeatures(mockUser, mockProduct)
      assert.deepEqual(features, fakeFeatures)
    })

    it('should called Mongodb.ObjectId with correct arguments', () => {
      assert(Mongodb.ObjectId.calledWithExactly(
        fakeFeatureListId
      ), 'invalid arguments')
    })

    it('should called findItem with correct arguments', () => {
      assert(Collections.findItem.calledWithExactly(
        config.mongo.collections.names.featureList, {
          _id: Mongodb.ObjectId(fakeFeatureListId)
        }
      ), 'invalid arguments')
    })

    it('should return empty array if feature list id is not found', async () => {
      const features = await FeatureLists.getFeatures(mockUser, mockProduct)
      assert.deepEqual(features, [])
    })
  })
})
