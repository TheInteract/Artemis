const chai = require('chai')
const sinon = require('sinon')
const url = require('url-join')
const BrowserFetch = require('../util/fetch')
const ResponseError = require('../errors/response')

const expect = chai.expect

describe('Browser Fetch', () => {
  describe('getOptions()', () => {
    const baseUrl = 'localhost'
    const headers = { authorization: 'hmac test:token' }
    const path = '/events/onclick'
    let fetch
    before(() => {
      fetch = new BrowserFetch(baseUrl, headers)
    })
    it('called with complete arguments', () => {
      const method = 'POST'
      const expected = {
        url: url(baseUrl, `api`, path),
        headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
        method,
        body: { test: 'result' },
        credentials: 'include',
      }
      const result = fetch.getOptions(path, method, expected.body)

      expected.body = JSON.stringify(expected.body)
      expect(result).to.eql(expected)
    })
    it('called with complete arguments except body', () => {
      const method = 'GET'
      const expected = {
        url: url(baseUrl, `api`, path),
        headers: Object.assign({}, headers),
        method,
        credentials: 'include',
      }
      const result = fetch.getOptions(path, method)
      expect(result).to.eql(expected)
    })
    it('called with path only', () => {
      const method = 'GET'
      const expected = {
        url: url(baseUrl, `api`, path),
        headers: Object.assign({}, headers),
        method,
        credentials: 'include',
      }
      const result = fetch.getOptions(path)
      expect(result).to.eql(expected)
    })
    it('called without any arguments', () => {
      expect(fetch.getOptions).to.throw(Error)
    })
  })
  describe('checkStatus()', () => {
    it('return response when status is 200', () => {
      const response = { status: 200, body: 'response' }
      const result = BrowserFetch.checkStatus(response)
      expect(result).to.be.eql(response)
    })
    it('throw Error when status >= 300', () => {
      const response = { status: 300, message: 'error', body: 'response' }
      const error = BrowserFetch.checkStatus.bind(null, response)
      expect(error).to.throw(ResponseError, new RegExp(response.message))
    })
  })
  describe('getHeader()', () => {
    const baseUrl = 'localhost'
    const headers = { authorization: 'hmac test:token' }
    let fetch
    before(() => {
      fetch = new BrowserFetch(baseUrl, headers)
    })
    it('called with GET method', () => {
      const expected = Object.assign({}, headers)
      const result = fetch.getHeader('GET')
      expect(result).to.be.eql(expected)
    })
    it('called with POST method', () => {
      const expected = Object.assign({ 'Content-Type': 'application/json' }, headers)
      const result = fetch.getHeader('POST')
      expect(result).to.be.eql(expected)
    })
    it('called without any arguments', () => {
      const expected = Object.assign({}, headers)
      const result = fetch.getHeader()
      expect(result).to.be.eql(expected)
    })
  })
  describe('doFetch()', () => {
    beforeEach(() => {
      sinon.stub(BrowserFetch, 'checkStatus')
    })
    afterEach(() => {
      BrowserFetch.checkStatus.restore()
    })
    it('request with error response', async () => {
      const response = { status: 300, message: 'error', body: 'response' }
      BrowserFetch.checkStatus.throws(new ResponseError(response.message, response.status, response))
      sinon.stub(BrowserFetch, 'getFetch').returns(Promise.resolve(response))

      try {
        await BrowserFetch.doFetch({ url: 'baseUrl' })
      } catch (err) {
        sinon.assert.calledOnce(BrowserFetch.checkStatus)
        expect(err).to.be.an.instanceOf(ResponseError)
      }
      BrowserFetch.getFetch.restore()
    })
    it('request with success response', async () => {
      const response = { json: () => ({
        status: 200,
        message: 'success',
        body: 'response'
      })}
      BrowserFetch.checkStatus.returns(response)
      sinon.stub(BrowserFetch, 'getFetch').returns(Promise.resolve(response))

      const result = await BrowserFetch.doFetch({ url: 'baseUrl' })
      sinon.assert.calledOnce(BrowserFetch.checkStatus)
      expect(result).to.be.eql(response.json())
    })
  })
  describe('class BrowserFetch', () => {
    it('declare with default header and base url', () => {
      const baseUrl = 'localhost'
      const headers = { authorization: 'hmac test:token' }
      const result = new BrowserFetch(baseUrl, headers)

      expect(result.baseUrl).to.be.equal(baseUrl)
      expect(result.headers).to.be.eql(headers)
      expect(result.get).to.not.be.null
      expect(result.post).to.not.be.null
      expect(result.put).to.not.be.null
      expect(result.patch).to.not.be.null
      expect(result.delete).to.not.be.null
    })
    it('declare with empty header', () => {
      const baseUrl = 'localhost'
      const result = new BrowserFetch(baseUrl)

      expect(result.baseUrl).to.be.equal(baseUrl)
      expect(result.headers).to.be.eql({})
      expect(result.get).to.not.be.null
      expect(result.post).to.not.be.null
      expect(result.put).to.not.be.null
      expect(result.patch).to.not.be.null
      expect(result.delete).to.not.be.null
    })
    it('declare without any parameters', () => {
      const result = new BrowserFetch()

      expect(result.baseUrl).to.be.equal('localhost')
      expect(result.headers).to.be.eql({})
      expect(result.get).to.not.be.null
      expect(result.post).to.not.be.null
      expect(result.put).to.not.be.null
      expect(result.patch).to.not.be.null
      expect(result.delete).to.not.be.null
    })
  })
})
