import CountItems from './CountItems'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('CountItems', () => {
  const mockCount = 6
  const stubCount = sinon.stub()
  const db = {
    collection: () => ({
      count: stubCount.returns(mockCount)
    })
  }

  it('should return item', async () => {
    assert.equal(await CountItems(db)('collectionName', 'query'), mockCount)
  })

  it('should call count once', () => {
    assert(stubCount.calledOnce, 'count should be called once')
  })
})
