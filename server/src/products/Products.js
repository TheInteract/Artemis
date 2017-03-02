import config from 'config'
import * as Collections from '../mongo/Collections'

export const getProductByPrivateKey = async (API_KEY_PRIVATE, ip) => {
  return await Collections.findItem(config.mongo.collections.names.product, {
    API_KEY_PRIVATE,
    ip
  })
}

export const getProductByPublicKey = async (API_KEY_PUBLIC, domainName) => {
  return await Collections.findItem(config.mongo.collections.names.product, {
    API_KEY_PUBLIC,
    domainName
  })
}
