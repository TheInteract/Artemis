const logger = require('winston')

const initEvent = async (ctx) => {
  const { body } = ctx.request
  const { hashedUserId } = body
  const { customerCode } = body
  const responseString = 'function(a,b,c,d,e){a.ic=function(b){a.i=b},d=b.createElement(c),e=b.getElementsByTagName(c)[0],d.async=!0,d.src="http://localhost:3000/analytics.js",e.parentNode.insertBefore(d,e)}(window,document,"script"),ic("IC9-55938-5"' + ', "' + customerCode + '");'
  const responseObj = {
    'featureList': [
      {
        'name': 'Card-1',
        'version': 'A'
      },
      {
        'name': 'Card-2',
        'version': 'B'
      }
    ],
    'code': responseString
  }
  ctx.body = responseObj
  logger.info('Responsed mock init event uid = ' + hashedUserId)
}

module.exports = { initEvent }
