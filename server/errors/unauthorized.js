export default class UnauthorizedError extends Error {
  constructor () {
    super()
    this.message = 'Access is denied'
    this.status = 401
  }
}
