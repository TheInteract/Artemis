import * as Collections from '../mongo/Collections'
import * as Users from './Users'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Users', () => {
  const mockUser = { name: 'hello it\'s me' }
  before(() => {
    sinon.stub(Collections, 'insertItem')
    Collections.insertItem.returns(mockUser)
    sinon.stub(Collections, 'findItem')
    Collections.findItem.returns(mockUser)
  })

  after(() => {
    Collections.insertItem.restore()
    Collections.findItem.restore()
  })

  describe('createUser', () => {
    describe('hashedUserId exists', () => {
      const fakeHashedUserId = 'fakeHashedUserId'
      const fakeDeviceCode = 'fakeDeviceCode'

      it('should return user from Collections.findItem', async () => {
        const user = await Users.createUser(fakeHashedUserId, fakeDeviceCode)
        assert.deepEqual(user, mockUser)
      })

      it('should called insertItem with hashedUserId', () => {
        assert(Collections.insertItem.calledWithExactly(
          config.mongo.collections.names.user, {
            userIdentity: fakeHashedUserId
          }
        ), 'invalid arguments')
      })
    })

    describe('hashedUserId does not exist', () => {
      const fakeHashedUserId = undefined
      const fakeDeviceCode = 'fakeDeviceCode'

      it('should return user from Collections.findItem', async () => {
        const user = await Users.createUser(fakeHashedUserId, fakeDeviceCode)
        assert.deepEqual(user, mockUser)
      })

      it('should called insertItem with deviceCode', () => {
        assert(Collections.insertItem.calledWithExactly(
          config.mongo.collections.names.user, {
            userIdentity: fakeDeviceCode
          }
        ), 'invalid arguments')
      })
    })
  })

  describe('getUser', () => {
    describe('hashedUserId exists', () => {
      const fakeHashedUserId = 'fakeHashedUserId'
      const fakeDeviceCode = 'fakeDeviceCode'

      it('should return user from Collections.findItem', async () => {
        const user = await Users.getUser(fakeHashedUserId, fakeDeviceCode)
        assert.deepEqual(user, mockUser)
      })

      it('should called findItem with hashedUserId', () => {
        assert(Collections.findItem.calledWithExactly(
          config.mongo.collections.names.user, {
            userIdentity: fakeHashedUserId
          }
        ), 'invalid arguments')
      })
    })

    describe('hashedUserId does not exist', () => {
      const fakeHashedUserId = undefined
      const fakeDeviceCode = 'fakeDeviceCode'

      it('should return user from Collections.findItem', async () => {
        const user = await Users.getUser(fakeHashedUserId, fakeDeviceCode)
        assert.deepEqual(user, mockUser)
      })

      it('should called findItem with deviceCode', () => {
        assert(Collections.findItem.calledWithExactly(
          config.mongo.collections.names.user, {
            userIdentity: fakeDeviceCode
          }
        ), 'invalid arguments')
      })
    })
  })
})
