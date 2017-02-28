export default class InvalidArgumentError extends Error {
  constructor () {
    super()
    this.message = 'Invalid argument'
    this.status = 401
  }
}
