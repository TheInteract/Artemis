import * as Collections from '../mongo/Collections'
import * as Version from './Version'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Version', () => {
  describe('create', () => {
    const fakeProductId = 'fakeProductId'
    const fakeUserId = 'fakeUserId'
    const fakeFeatureId = 'fakeFeatureId'

    const mockVersion = {
      productId: fakeProductId,
      userId: fakeUserId,
      featureId: fakeFeatureId,
    }

    before(() => {
      sinon.stub(Collections, 'insertItem')
      Collections.insertItem.returns(mockVersion)
    })

    after(() => {
      Collections.insertItem.restore()
    })

    it('should return inserted version from Collections.insertItem', async () => {
      const version = await Version.create(fakeProductId, fakeUserId, fakeFeatureId)
      assert.deepEqual(version, mockVersion)
    })

    it('should called insertItem with correct arguments', () => {
      assert(Collections.insertItem.calledWithExactly(
        config.mongo.collections.names.version, {
          productId: fakeProductId,
          userId: fakeUserId,
          featureId: fakeFeatureId,
          name: 1
        }
      ), 'invalid arguments')
    })
  })
})
