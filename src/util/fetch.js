const url = require('url')

class BrowserFetch {
    constructor(baseUrl, headers) {
        this.baseUrl = baseUrl
        this.headers = headers
    }

    get(path) {
        const options = this.getOptions(path, 'GET')
        this.doFetch(options)
    }

    post(path, body) {
        const options = this.getOptions(path, 'POST', body)
        this.doFetch(options)
    }

    put(path, body) {
        const options = this.getOptions(path, 'PUT', body)
        this.doFetch(options)
    }

    patch(path, body) {
        const options = this.getOptions(path, 'PATCH', body)
        this.doFetch(options)
    }

    delete(path) {
        const options = this.getOptions(path, 'DELETE')
        this.doFetch(options)
    }

    getOptions(path, method = 'GET', body = {}) {
        const defaultOption = {
            url: url.resolve(this.baseUrl, path),
            headers: this.getHeader(method),
            method,
        }

        if (Object.keys(body).length > 0) {
            defaultOption.body = body
        }

        return defaultOption
    }

    checkStatus(response) {
        if (response.status < 200 && response.status >= 300) {
            const error = new Error(response.message)
            error.status = response.status
            error.response = response
            throw error
        }
        return response
    }

    getHeader(method) {
        const headers = Object.assign({}, this.headers)
        if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
            return Object.assign({}, headers, { 'Content-Type': 'application/json' })
        }
        return headers
    }

    doFetch(options) {
        return fetch(options.url, options)
            .then(this.checkStatus)
            .then(response => response.json())
            .catch((error) => {
                console.error(error)
            })
    }
}

module.exports = BrowserFetch
