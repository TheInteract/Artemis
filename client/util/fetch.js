const url = require('url-join')
const ResponseError = require('../errors/response')

class BrowserFetch {
  constructor (baseUrl, headers) {
    this.baseUrl = baseUrl || 'localhost'
    this.headers = headers || {}
  }

  get (path) {
    const options = this.getOptions(path, 'GET')
    return BrowserFetch.doFetch(options)
  }

  post (path, body) {
    const options = this.getOptions(path, 'POST', body)
    return BrowserFetch.doFetch(options)
  }

  put (path, body) {
    const options = this.getOptions(path, 'PUT', body)
    return BrowserFetch.doFetch(options)
  }

  patch (path, body) {
    const options = this.getOptions(path, 'PATCH', body)
    return BrowserFetch.doFetch(options)
  }

  delete (path) {
    const options = this.getOptions(path, 'DELETE')
    return BrowserFetch.doFetch(options)
  }

  getOptions (path, method = 'GET', body = {}) {
    if (arguments.length === 0) {
      throw new Error('getOptions in BrowserFetch shold has at least 1 argument')
    }
    const defaultOption = {
      url: url(this.baseUrl, path),
      headers: this.getHeader(method),
      credentials: 'include',
      method,
    }

    if (Object.keys(body).length > 0) {
      defaultOption.body = JSON.stringify(body)
    }

    return defaultOption
  }

  getHeader (method = 'GET') {
    const headers = Object.assign({}, this.headers)
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      return Object.assign({}, headers, { 'Content-Type': 'application/json' })
    }
    return headers
  }

  static checkStatus (response) {
    if (response.status < 200 || response.status >= 300) {
      throw new ResponseError(response.message, response.status, response)
    }
    return response
  }

  static doFetch (options) {
    return BrowserFetch.getFetch(options.url, options)
      .then(BrowserFetch.checkStatus)
      .then(getJson)
      // TODO: send error log to server
  }

  static getFetch (_url, options) {
    return window.fetch(_url, options)
  }
}

function getJson (response) {
  return response.json()
}

module.exports = BrowserFetch
