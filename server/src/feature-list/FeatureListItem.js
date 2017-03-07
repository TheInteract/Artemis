import * as Features from '../features/Features'

export const create = async version => ({
  featureName: await Features.getFeature(version.featureId),
  version: version.name
})
