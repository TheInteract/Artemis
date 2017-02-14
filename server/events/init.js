const logger = require('winston')

const initEvent = async (ctx) => {
  const { body } = ctx.request
  const { hashedUserId } = body
  const { customerCode } = body
  const responseString = `(function (window, document, tag, target, element) {window['ic'] = function (i) {window.i = i}target = document.createElement(tag)element = document.getElementsByTagName(tag)[0]target.async = truetarget.src = 'http://localhost:3000/analytics.js'element.parentNode.insertBefore(target, element)})(window, document, 'script')ic('IC9-55938-5'` + ', \'' + customerCode + '\')'
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
