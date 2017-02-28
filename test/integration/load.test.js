const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server/server')
const sinon = require('sinon')
const store = require('../../server/util/store')
const mongodb = require('../../server/util/mongodb')
const { generate } = require('../../server/util/CookieUtil')

const expect = chai.expect
chai.use(chaiHttp)
const request = chai.request.agent(server.listen())

describe('Event load', () => {
  describe('server', () => {
    beforeEach(() => {
      sinon.stub(store, 'save').returns({})
      sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => true }), close: () => {} })
    })
    it('POST /api/event/onload with authorization', (done) => {
      const req = request.post('/api/event/onload')
      req.cookies = 'collector_uuid=' + generate()
      req.send({ customerCode: 'TEST-1CA' })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          done()
        })
    })
    it('POST /api/event/onload with unauthorization')
    it('called load event and store to redis')
  })
  describe('client', () => {
    it('load event happened and post data to server')
  })
})
