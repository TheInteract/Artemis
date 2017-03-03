import FindItems from './FindItems'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('FindItems', () => {
  const mockItems = [ 'hello', 'it\'s me' ]
  const stubFind = sinon.stub()
  const db = {
    collection: () => ({
      find: stubFind.returns({ toArray: () => mockItems })
    })
  }

  it('should return array of items', async () => {
    assert.deepEqual(await FindItems(db)('collectionName', 'query'), mockItems)
  })

  it('should call find once', () => {
    assert(stubFind.calledOnce, 'find should be called once')
  })
})
