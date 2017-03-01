import store from '../util/store'

export default async (cookie, body) => {
  const { API_KEY, ...rest } = body
  await store.save(API_KEY, cookie, rest, 'scroll')
}
