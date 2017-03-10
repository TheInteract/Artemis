import * as Collections from '../src/mongo/Collections'

import config from 'config'
import fs from 'fs'
import jsf from 'json-schema-faker'
import yaml from 'js-yaml'

async function init () {
  try {
    const mockFeature = yaml.safeLoad(fs.readFileSync('schema/FeatureSchema.yml'), 'utf-8')
    const mockProduct = yaml.safeLoad(fs.readFileSync('schema/ProductSchema.yml'), 'utf-8')

    const product = await Collections.insertItem(config.mongo.collections.names.product, jsf(mockProduct))
    console.log(product)

    const fakeFeature = jsf(mockFeature)
    fakeFeature.productId = product._id

    const feature = await Collections.insertItem(config.mongo.collections.names.feature, fakeFeature)
  } catch (e) {
    console.log(e)
  }
}

init()
