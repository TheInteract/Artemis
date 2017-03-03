import * as Collections from '../mongo/Collections'
import * as User from './User'
import * as Users from './Users'

import chai from 'chai'
import config from 'config'
import sinon from 'sinon'

const assert = chai.assert

describe('Users', () => {
  describe('getUser', () => {
    const mockUser = { _id: 'fakeUserId' }

    describe('user already exists', () => {
      before(() => {
        sinon.stub(User, 'create')
        User.create.returns(mockUser)
        sinon.stub(Collections, 'findItem')
        Collections.findItem.returns(mockUser)
      })

      after(() => {
        User.create.restore()
        Collections.findItem.restore()
      })

      describe('hashedUserId exists', () => {
        const fakeHashedUserId = 'fakeHashedUserId'
        const fakeDeviceCode = 'fakeDeviceCode'

        it('should return user with correct information', async () => {
          const user = await Users.getUser(fakeHashedUserId, fakeDeviceCode)
          assert.deepEqual(user, mockUser)
        })

        it('should called Collections.findItem with hashedUserId', () => {
          assert(Collections.findItem.calledWithExactly(
            config.mongo.collections.names.user, {
              userIdentity: fakeHashedUserId
            }
          ), 'invalid arguments')
        })

        it('shouldn\'t call User.create', () => {
          assert(User.create.notCalled, 'it should return existed user ' +
            'without calling create new user')
        })
      })

      describe('hashedUserId does not exist', () => {
        const fakeHashedUserId = undefined
        const fakeDeviceCode = 'fakeDeviceCode'

        it('should return user with correct information', async () => {
          const user = await Users.getUser(fakeHashedUserId, fakeDeviceCode)
          assert.deepEqual(user, mockUser)
        })

        it('should called Collections.findItem with deviceCode', () => {
          assert(Collections.findItem.calledWithExactly(
            config.mongo.collections.names.user, {
              userIdentity: fakeDeviceCode
            }
          ), 'invalid arguments')
        })

        it('shouldn\'t call User.create', () => {
          assert(User.create.notCalled, 'it should return existed user ' +
            'without calling create new user')
        })
      })
    })

    describe('new user', () => {
      before(() => {
        sinon.stub(User, 'create')
        User.create.returns(mockUser)
        sinon.stub(Collections, 'findItem')
        Collections.findItem.returns()
      })

      after(() => {
        User.create.restore()
        Collections.findItem.restore()
      })

      const fakeHashedUserId = 'fakeHashedUserId'
      const fakeDeviceCode = 'fakeDeviceCode'

      it('should return user with correct information', async () => {
        const user = await Users.getUser(fakeHashedUserId, fakeDeviceCode)
        assert.deepEqual(user, mockUser)
      })

      it('should called User.create', () => {
        assert(User.create.calledWithExactly(fakeHashedUserId, fakeDeviceCode),
          'invalid arguments')
      })
    })
  })
})
