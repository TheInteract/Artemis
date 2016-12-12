const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../src/server')
const config = require('config')

const expect = chai.expect
chai.use(chaiHttp)
const request = chai.request.agent(server.listen())

describe('Event load', () => {
    it('POST /api/event/load with authorization', (done) => {
        request.post('/api/event/load', {})
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.cookie(config.get('cookie.name'))
                expect(res).to.have.status(200)
                done()
            })
    })
    it('POST /api/event/load with unauthorization')
})