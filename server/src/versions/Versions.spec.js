import * as Versions from './Versions'

describe('Versions', () => {
  const mockProduct = { _id: 'fakeProductId' }
  const mockUser = { _id: 'fakeUserId' }
  const mockFeature = { _id: 'fakeFeatureId' }

  describe('countVersions', () => {
    const count = Versions.countVersions(mockProduct, mockFeature)

    it('should test')
  })

  describe('getFeatureList', () => {
    const versions = Versions.getFeatureList(mockProduct._id, mockUser._id)
  })
})
