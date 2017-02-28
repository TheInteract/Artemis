import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../server/server'

chai.use(chaiHttp)

const expect = chai.expect
const request = chai.request.agent(server.listen())

describe('Init', () => {
  describe('init', () => {
    describe('No hashedUserId', () => {
      describe('No deviceCode', () => {
        it('should return deviceCode, featureList and initCode')
      })

      describe('Has valid deviceCode', () => {
      })

      describe('Has Invalid deviceCode', () => {
      })
    })
    describe('Has hashedUserId', () => {
      describe('No deviceCode', () => {
      })

      describe('Has valid deviceCode', () => {
      })

      describe('Has Invalid deviceCode', () => {
      })
    })
  })
})
