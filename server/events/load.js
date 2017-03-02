import config from 'config'
import store from '../util/store'

const loadEvent = async (ctx) => {
  const cookieName = config.get('cookie.name')
  const uid = ctx.cookies.get(cookieName) || ctx.state.tmpCookie
  const { body } = ctx.request
  const { API_KEY, ...rest } = body

  await store.save(API_KEY, uid, rest, 'load')
  ctx.status = 200
}

export default loadEvent
