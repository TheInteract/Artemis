import omit from 'lodash/omit'
import store from '../util/store'

export default async (cookie, body) => {
  const { customerCode } = body
  const rest = omit(body, [ 'customerCode' ])
  await store.save(customerCode, cookie, rest, 'resize')
}
