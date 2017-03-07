import * as Collections from '../mongo/Collections'
import * as Version from './Version'
import * as Versions from './Versions'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Version', () => {
  describe('create', () => {
    const fakeProductId = 'fakeProductId'
    const fakeUserId = 'fakeUserId'
    const fakeFeatureId = 'fakeFeatureId'
    const mockFeature = {
      _id: fakeFeatureId
    }

    const mockVersion = {
      productId: fakeProductId,
      userId: fakeUserId,
      featureId: fakeFeatureId,
    }

    const mockVersionsSortedByCount = [ 'A', 'B' ]

    before(() => {
      sinon.stub(Collections, 'insertItem')
      Collections.insertItem.returns(mockVersion)
      sinon.stub(Versions, 'getVersionsSortedByCount')
      Versions.getVersionsSortedByCount.returns(mockVersionsSortedByCount)
    })

    after(() => {
      Collections.insertItem.restore()
      Versions.getVersionsSortedByCount.restore()
    })

    it('should return inserted version from Collections.insertItem', async () => {
      const version = await Version.create(fakeProductId, fakeUserId, mockFeature)
      assert.deepEqual(version, mockVersion)
    })

    it('should called Versions.getVersionsSortedByCount with correct arguments', () => {
      assert(Versions.getVersionsSortedByCount.calledWithExactly(
        mockFeature
      ), 'invalid arguments')
    })

    it('should called Collections.insertItem with correct arguments', () => {
      assert(Collections.insertItem.calledWithExactly(
        config.mongo.collections.names.version, {
          productId: fakeProductId,
          userId: fakeUserId,
          featureId: fakeFeatureId,
          name: mockVersionsSortedByCount[0]
        }
      ), 'invalid arguments')
    })
  })
})
