const chai = require('chai')
const url = require('url')
const BrowserFetch = require('../../src/util/fetch')

const expect = chai.expect

describe('Browser Fetch', () => {
    describe('getOptions()', () => {
        const baseUrl = 'localhost'
        const headers = { authorization: 'hmac test:token' }
        const path = '/api/events/click'
        let fetch
        beforeEach(() => {
            fetch = new BrowserFetch(baseUrl, headers)
        })
        it('called with complete arguments', () => {
            const method = 'POST'
            const expected = {
                url: url.resolve(baseUrl, path),
                headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
                method,
                body: { test: 'result' },
            }
            const result = fetch.getOptions(path, method, expected.body)
            expect(result).to.eql(expected)
        })
        it('called with complete arguments except body', () => {
            const method = 'GET'
            const expected = {
                url: url.resolve(baseUrl, path),
                headers: Object.assign({}, headers),
                method,
            }
            const result = fetch.getOptions(path, method)
            expect(result).to.eql(expected)
        })
        it('called with path only', () => {
            const method = 'GET'
            const expected = {
                url: url.resolve(baseUrl, path),
                headers: Object.assign({}, headers),
                method,
            }
            const result = fetch.getOptions(path)
            expect(result).to.eql(expected)
        })
        it('called without any arguments', () => {
            expect(fetch.getOptions).to.throw(Error)
        })
    })
    describe('checkStatus()', () => {
        it('return response when status is 200')
        it('throw Error when status >= 300')
    })
    describe('getHeader()', () => {
        it('called with GET method')
        it('called with POST method')
        it('called without any arguments')
    })
    describe('doFetch()', () => {
        it('request with error response')
        it('request with success response')
    })
    describe('class BrowserFetch', () => {
        it('declare with default header and base url')
        it('declare with empty header')
        it('declare without any parameters')
    })
})
