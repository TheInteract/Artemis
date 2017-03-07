import * as Collections from '../mongo/Collections'
import * as User from './User'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('User', () => {
  describe('create', () => {
    const mockUser = { _id: 'fakeUserId' }
    before(() => {
      sinon.stub(Collections, 'insertItem')
      Collections.insertItem.returns(mockUser)
    })

    after(() => {
      Collections.insertItem.restore()
    })

    describe('hashedUserId exists', () => {
      const fakeHashedUserId = 'fakeHashedUserId'
      const fakeDeviceCode = 'fakeDeviceCode'

      it('should return inserted user from Collections.insertItem', async () => {
        const user = await User.create(fakeHashedUserId, fakeDeviceCode)
        assert.deepEqual(user, mockUser)
      })

      it('should called Collections.insertItem with hashedUserId', () => {
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

      it('should return inserted user from Collections.insertItem', async () => {
        const user = await User.create(fakeHashedUserId, fakeDeviceCode)
        assert.deepEqual(user, mockUser)
      })

      it('should called Collections.insertItem with deviceCode', () => {
        assert(Collections.insertItem.calledWithExactly(
          config.mongo.collections.names.user, {
            userIdentity: fakeDeviceCode
          }
        ), 'invalid arguments')
      })
    })

    describe('Collections.insertItem does not answer', () => {
      it('shoud test?')
    })
  })
})
