import config from 'config'
import logger from 'winston'
import * as events from '../events'

const saveEvent = async (ctx) => {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)
  const { body } = ctx.request
  const action = ctx.params.type
  // An error should not throw to client side.
  try {
    await events[action](cookie, body)
    logger.info(`request to ${action} event success:`, { cookie, ip: ctx.request.ip })
    ctx.body = {'test': 'eiei'}
    if (!ctx.body) {
      ctx.body = {}
    }
    ctx.status = 200
  } catch (e) {
    logger.info(`request to ${action} event error:`, { cookie, ip: ctx.request.ip, error: e.message })
    ctx.throw(e.message, e.status)
  }
}

module.exports = { saveEvent }
