const config = require('config')
const omit = require('lodash/omit')
const store = require('../util/store')

const loadEvent = async (ctx) => {
  const cookieName = config.get('cookie.name')
  const uid = ctx.cookies.get(cookieName) || ctx.state.tmpCookie
  const { body } = ctx.request
  const { customerCode } = body

  const rest = omit(body, [ 'customerCode' ])

  await store.save(customerCode, uid, rest, 'load')
  ctx.status = 200
}

module.exports = { loadEvent }
