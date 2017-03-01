import config from 'config'
import * as Collections from '../mongo/Collections'

export const getProduct = async (API_KEY, hostname) => {
  return Collections.findItem(config.mongo.collections.names.product, {
    API_KEY,
    hostname
  })
}
