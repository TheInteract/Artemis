export default class UnauthorizedError extends Error {
  constructor (message = '') {
    super(message)
    this.message = `Access is denied(${message})`
    this.status = 401
  }
}
