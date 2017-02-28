import store from '../util/store'

export default async (cookie, body) => {
  const { customerCode, ...rest } = body
  await store.save(customerCode, cookie, rest, 'scroll')
}
