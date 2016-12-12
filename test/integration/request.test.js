const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server')

const expect = chai.expect
chai.use(chaiHttp)
const request = chai.request.agent(server.listen())

describe('Request to every endpoint', () => {
    it('POST /api/event/:type with valid token')
    it('POST /api/event/:type with invalid token')
    it('POST /api/event/:type without token')
    it('POST /api/event/:type with invalid type')
})
