import * as Features from '../features/Features'

export const create = version => ({
  featureName: Features.getFeature(version.featureId),
  version: version.name
})
