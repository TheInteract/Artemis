import * as FeatureLists from './FeatureLists'
import * as Features from '../features/Features'
import * as Version from '../versions/Version'
import * as Versions from '../versions/Versions'

import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('FeatureList', () => {
  describe('getFeatureList', () => {
    const mockTotalFeatures = [
      { _id: 'fakeFeatureId-2', name: 'fakeFeature-2' },
      { _id: 'fakeFeatureId-3', name: 'fakeFeature-3' },
      { _id: 'fakeFeatureId-4', name: 'fakeFeature-4' },
      { _id: 'fakeFeatureId-5', name: 'fakeFeature-5' },
    ]
    const mockCurrentFeatureList = [
      { featureId: 'fakeFeatureId-1', version: 'A' },
      { featureId: 'fakeFeatureId-2', version: 'A' },
      { featureId: 'fakeFeatureId-3', version: 'B' },
    ]

    const mockNewVersions = [
      { featureId: 'fakeFeatureId-4', version: 'B' },
      { featureId: 'fakeFeatureId-5', version: 'A' }
    ]

    before(() => {
      sinon.stub(Features, 'getFeaturesByProduct')
      Features.getFeaturesByProduct.returns(mockTotalFeatures)
      sinon.stub(Versions, 'getVersions')
      Versions.getVersions.returns(mockCurrentFeatureList)
      sinon.stub(Version, 'create')
      Version.create.onCall(0).returns(mockNewVersions[0])
      Version.create.onCall(1).returns(mockNewVersions[1])
    })

    after(() => {
      Features.getFeaturesByProduct.restore()
      Versions.getVersions.restore()
      Version.create.restore()
    })

    const fakeProductId = 'fakeProductId'
    const fakeUserId = 'fakeUserId'

    it('should return correct result', async () => {
      const result = await FeatureLists.getFeatureList(fakeProductId, fakeUserId)
      assert.deepEqual(result, [
        mockCurrentFeatureList[1],
        mockCurrentFeatureList[2],
        mockNewVersions[0],
        mockNewVersions[1],
      ])
    })

    it('should called Features.getFeaturesByProduct with product id', () => {
      assert(Features.getFeaturesByProduct.calledWithExactly(
        fakeProductId
      ), 'invalid arguments')
    })

    it('should called Versions.getVersions product id and user id', () => {
      assert(Versions.getVersions.calledWithExactly(
        fakeProductId,
        fakeUserId,
      ), 'invalid arguments')
    })

    it('should called Version.create twice', () => {
      assert.isTrue(Version.create.calledTwice)
    })

    it('should called Version.create first time with first new feature', () => {
      assert(Version.create.firstCall.calledWithExactly(
        fakeProductId,
        fakeUserId,
        mockTotalFeatures[2]
      ), 'invalid arguments')
    })

    it('should called Version.create first time with second new feature', () => {
      assert(Version.create.secondCall.calledWithExactly(
        fakeProductId,
        fakeUserId,
        mockTotalFeatures[3]
      ), 'invalid arguments')
    })
  })
})
