import * as Features from '../features/Features'

export const create = async version => ({
  featureName: await Features.getFeature(version.featureId).name,
  version: version.name
})
