import * as FeatureLists from './FeatureLists'
import * as Features from '../features/Features'
import * as Version from '../versions/Version'
import * as Versions from '../versions/Versions'

import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('FeatureList', () => {
  const mockProduct = { _id: 'fakeProductId' }
  const mockTotalList = [
    { _id: 'fakeFeatureId-2', name: 'fakeFeature-2' },
    { _id: 'fakeFeatureId-3', name: 'fakeFeature-3' },
    { _id: 'fakeFeatureId-4', name: 'fakeFeature-4' },
  ]
  const mockCurrentList = [
    { name: 'fakeFeature-1', version: 'A' },
    { name: 'fakeFeature-2', version: 'A' },
    { name: 'fakeFeature-3', version: 'B' },
  ]

  const mockNewVersion = { name: 'fakeFeature-4', version: 'B' }

  before(() => {
    sinon.stub(Features, 'getFeaturesByProduct')
    Features.getFeaturesByProduct.returns(mockTotalList)
    sinon.stub(Versions, 'getFeatureList')
    Versions.getFeatureList.returns(mockCurrentList)
    sinon.stub(Version, 'create')
    Version.create.onCall(0).returns(mockNewVersion)
  })

  after(() => {
    Features.getFeaturesByProduct.restore()
    Versions.getFeatureList.restore()
    Version.create.restore()
  })

  it('should test', () => {
    const result = FeatureLists.getFeatureList(mockProduct, mockCurrentList)
    assert.deepEqual(result, [
      { name: 'fakeFeature-2', version: 'A' },
      { name: 'fakeFeature-3', version: 'B' },
      { name: 'fakeFeature-4', version: 'B' },
    ])
  })
})
