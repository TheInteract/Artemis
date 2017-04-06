import * as FeatureListItem from './FeatureListItem'
import * as FeatureLists from './FeatureLists'
import * as Features from '../features/Features'
import * as Version from '../versions/Version'
import * as Versions from '../versions/Versions'

import _ from 'lodash'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('FeatureList', () => {
  describe('getFeatureList', () => {
    const mockTotalFeatures = [
      { _id: 'fakeFeatureId-2', name: 'fakeFeature-2', active: true },
      { _id: 'fakeFeatureId-3', name: 'fakeFeature-3', active: true },
      { _id: 'fakeFeatureId-4', name: 'fakeFeature-4', active: true },
      { _id: 'fakeFeatureId-5', name: 'fakeFeature-5', active: false },
    ]
    const mockCurrentFeatureList = [
      { featureId: 'fakeFeatureId-1', name: 'A' },
      { featureId: 'fakeFeatureId-2', name: 'A' },
      { featureId: 'fakeFeatureId-3', name: 'B' },
    ]

    const mockNewVersions = [
      { featureId: 'fakeFeatureId-4', name: 'B' },
      { featureId: 'fakeFeatureId-5', name: 'Closed' }
    ]

    before(() => {
      sinon.stub(Features, 'getFeaturesByProduct')
      Features.getFeaturesByProduct.returns(mockTotalFeatures)
      sinon.stub(Versions, 'getVersions')
      Versions.getVersions.returns(mockCurrentFeatureList)
      sinon.stub(Version, 'create')
      Version.create.onCall(0).returns(mockNewVersions[0])
      Version.create.onCall(1).returns(mockNewVersions[1])
      sinon.stub(FeatureListItem, 'create')
      FeatureListItem.create.callsFake((args) => ({ featureName: args.featureId, version: args.name }))
    })

    after(() => {
      Features.getFeaturesByProduct.restore()
      Versions.getVersions.restore()
      Version.create.restore()
      FeatureListItem.create.restore()
    })

    const fakeProductId = 'fakeProductId'
    const fakeUserId = 'fakeUserId'
    const changeKeyName = (obj, oldKey, newKey) => _.transform(obj, (result, value, key) => {
      const i = _.indexOf(oldKey, key)
      if (i > -1) {
        result[newKey[i]] = value
      } else {
        result[key] = value
      }
    }, {})

    it('should return correct result', async () => {
      const result = await FeatureLists.getFeatureList(fakeProductId, fakeUserId)
      assert.deepEqual(result, [
        changeKeyName(mockCurrentFeatureList[1], [ 'name', 'featureId' ], [ 'version', 'featureName' ]),
        changeKeyName(mockCurrentFeatureList[2], [ 'name', 'featureId' ], [ 'version', 'featureName' ]),
        changeKeyName(mockNewVersions[0], [ 'name', 'featureId' ], [ 'version', 'featureName' ]),
        changeKeyName(mockNewVersions[1], [ 'name', 'featureId' ], [ 'version', 'featureName' ]),
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

    it('should called Version.create once', () => {
      assert.isTrue(Version.create.calledOnce)
    })

    it('should called Version.create first time with first new feature', () => {
      assert(Version.create.firstCall.calledWithExactly(
        fakeProductId,
        fakeUserId,
        mockTotalFeatures[2]
      ), 'invalid arguments')
    })
  })
})
