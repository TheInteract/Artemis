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
    ]
    const mockCurrentFeatureList = [
      { featureId: 'fakeFeatureId-1', version: 'A' },
      { featureId: 'fakeFeatureId-2', version: 'A' },
      { featureId: 'fakeFeatureId-3', version: 'B' },
    ]

    const mockNewVersion = { featureId: 'fakeFeatureId-4', version: 'B' }

    before(() => {
      sinon.stub(Features, 'getFeaturesByProduct')
      Features.getFeaturesByProduct.returns(mockTotalFeatures)
      sinon.stub(Versions, 'getVersions')
      Versions.getVersions.returns(mockCurrentFeatureList)
      sinon.stub(Version, 'create')
      Version.create.onCall(0).returns(mockNewVersion)
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
        { featureId: 'fakeFeatureId-2', version: 'A' },
        { featureId: 'fakeFeatureId-3', version: 'B' },
        { featureId: 'fakeFeatureId-4', version: 'B' },
      ])
    })

    it('should call Features.getFeaturesByProduct ...')
    it('should call Versions.getVersions ...')
    it('should call Version.create if ...')
  })
})
