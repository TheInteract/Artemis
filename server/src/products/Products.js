import * as Collections from '../mongo/Collections'

import config from 'config'

export const getProductByPrivateKey = async (API_KEY_PRIVATE) => {
  return await Collections.findItem(config.mongo.collections.names.product, {
    API_KEY_PRIVATE
  })
}

export const getProductByPublicKey = async (API_KEY_PUBLIC, domainName) => {
  return await Collections.findItem(config.mongo.collections.names.product, {
    API_KEY_PUBLIC,
    domainName
  })
}
