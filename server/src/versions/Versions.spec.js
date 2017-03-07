import * as Collections from '../mongo/Collections'
import * as Versions from './Versions'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Versions', () => {
  describe('getVersionsSortedByCount', () => {
    before(() => {
      sinon.stub(Collections, 'countItems')
      Collections.countItems.onCall(0).returns(20)
      Collections.countItems.onCall(1).returns(10)
    })

    after(() => {
      Collections.countItems.restore()
    })

    const fakeFeatureId = 'fakeFeatureId-1'
    const mockFeature = {
      _id: fakeFeatureId,
      name: 'fakeFeatureName-1',
      proportion: { A: 50, B: 50 }
    }

    it('should return correct sorted versions', async () => {
      const versions = await Versions.getVersionsSortedByCount(mockFeature)
      assert.deepEqual(versions, [ 'B', 'A' ])
    })

    it('should called countItems twice', () => {
      assert.isTrue(Collections.countItems.calledTwice)
    })

    it('should called countItems first time with correct arguments', () => {
      assert(Collections.countItems.firstCall.calledWithExactly(
        config.mongo.collections.names.version, {
          featureId: fakeFeatureId,
          name: 'A'
        }
      ), 'invalid arguments')
    })

    it('should called countItems second time with correct arguments', () => {
      assert(Collections.countItems.secondCall.calledWithExactly(
        config.mongo.collections.names.version, {
          featureId: fakeFeatureId,
          name: 'B'
        }
      ), 'invalid arguments')
    })
  })
  describe('getVersions', () => {
    const fakeProductId = 'fakeProductId'
    const fakeUserId = 'fakeUserId'
    const mockVersions = [
      { productId: 'pid-1', userId: 'uid-1', featureId: 'fid-1', name: 'A' },
      { productId: 'pid-2', userId: 'uid-2', featureId: 'fid-2', name: 'B' },
    ]

    before(() => {
      sinon.stub(Collections, 'findItems')
      Collections.findItems.returns(mockVersions)
    })

    after(() => {
      Collections.findItems.restore()
    })

    it('should return items from Collections.findItem', async () => {
      const product = await Versions.getVersions(
        fakeProductId,
        fakeUserId
      )
      assert.equal(product, mockVersions)
    })

    it('should called Collections.findItem with correct arguments', () => {
      assert(Collections.findItems.calledWithExactly(
        config.mongo.collections.names.version, {
          productId: fakeProductId,
          userId: fakeUserId
        }
      ), 'invalid arguments')
    })
  })
})
