class InvaidArgumentError extends Error {
  constructor () {
    super()
    this.message = 'Invalid argument'
    this.status = 401
  }
}

module.exports = InvaidArgumentError
