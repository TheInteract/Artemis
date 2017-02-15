const config = require('config')
const logger = require('winston')
const events = require('../events')

const saveEvent = async (ctx) => {
  const cookieName = config.get('cookie.name')
  const cookie = ctx.cookies.get(cookieName)
  const { body } = ctx.request
  const action = ctx.params.type
  // An error should not throw to client side.
  try {
    await events[action].handleEvent(cookie, body)
    logger.info(`request to ${action} event success:`, { cookie, ip: ctx.request.ip })
    ctx.status = 200
    if (!ctx.body) {
      ctx.body = {}
    }
  } catch (e) {
    logger.info(`request to ${action} event error:`, { cookie, ip: ctx.request.ip, error: e.message })
    ctx.throw(e.message, e.status)
  }
}

module.exports = { saveEvent }
