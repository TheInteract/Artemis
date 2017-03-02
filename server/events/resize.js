import omit from 'lodash/omit'
import store from '../util/store'

export default async (cookie, body) => {
  const { API_KEY } = body
  const rest = omit(body, [ 'API_KEY' ])
  await store.save(API_KEY, cookie, rest, 'resize')
}
