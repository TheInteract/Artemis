const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

let prevTime = new Date(0)

function handleMousemoveEvent (e) {
  const now = new Date()
  if (now - prevTime > 500) {
    prevTime = new Date()
    const data = pickProperties(e, PROPERTIES)
    data.API_KEY_PUBLIC = this.API_KEY_PUBLIC
    this.fetch.post('/event/onmousemove', data)
  }
}

module.exports = handleMousemoveEvent
