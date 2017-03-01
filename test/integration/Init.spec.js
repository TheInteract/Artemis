import Endpoints from '../../server/util/endpoints'
import chai from 'chai'
import chaiHttp from 'chai-http'
import mongodb from '../../server/util/mongodb'
import server from '../../server/server'
import sinon from 'sinon'

chai.use(chaiHttp)

const expect = chai.expect
const request = chai.request.agent(server.listen())

describe('Init', () => {
  describe('init', () => {
    describe('No API_KEY', () => {
      it('should return a error')
    })

    describe('No hashedUserId', () => {
      it('should return deviceCode, featureList and initCode')
      describe('No deviceCode', () => {
        it('should return a deviceCode', (done) => {
          sinon.stub(mongodb, 'connectDB').returns({ collection: () => ({ findOne: () => true }), close: () => {} })
          const req = request.post('/api' + Endpoints.INIT_EVENT)
          req.send()
            .end((err, res) => {
              expect(err).to.be.null
              expect(res).to.have.status(200)
              done()
            })
        })

        it('should return a featureList')
      })

      describe('Has valid deviceCode', () => {
        it('should return same deviceCode')

        it('should return updated featureList')
      })

      describe('Has Invalid deviceCode', () => {
        it('should return new deviceCode')

        it('should return new featureList')
      })
    })
    describe('Has hashedUserId', () => {
      it('should return deviceCode, userCode, featureList and initCode')
      describe('No deviceCode', () => {
        it('should return a deviceCode')
        it('should return a userCode')
        it('should return updated featureList')
      })

      describe('Has valid deviceCode', () => {
        it('should return a userCode')
        it('should return updated featureList')
      })

      describe('Has Invalid deviceCode', () => {
        it('should return a userCode')
        it('should return updated featureList')
      })
    })
  })
})
