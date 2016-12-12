const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server')

const expect = chai.expect
chai.use(chaiHttp)
const request = chai.request.agent(server.listen())

describe('Request to every endpoint', () => {
    it('GET /api/reg', (done) => {
        request.get('/api/reg')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('token')
                done()
            })
    })
    it('POST /api/event/:type with valid token')
    it('POST /api/event/:type with invalid token')
    it('POST /api/event/:type without token')
    it('POST /api/event/:type with invalid type')
})
