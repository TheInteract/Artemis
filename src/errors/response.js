class ResponseError extends Error {
    constructor(message, status, response) {
        super()
        this.message = message
        this.status = status
        this.response = response
    }
}

module.exports = ResponseError
