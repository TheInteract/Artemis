const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server')

const expect = chai.expect
chai.use(chaiHttp)
const request = chai.request.agent(server.listen())

describe('Serve analytics.js', () => {
    it('GET /analytics.js', (done) => {
        request.get('/analytics.js')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).have.status(200)
                expect(res).have.header('Content-Type', /application\/javascript/)
                expect(res).to.be.js
                done()
            })
    })
    it('GET /test-analytics.js', (done) => {
        request.get('/test-analytics.js')
            .end((err, res) => {
                expect(err).not.be.null
                expect(res).have.status(404)
                done()
            })
    })
})
