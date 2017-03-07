import FindItem from './FindItem'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('FindItem', () => {
  const mockItem = 'hello'
  const stubFindOne = sinon.stub()
  const db = {
    collection: () => ({
      findOne: stubFindOne.returns(mockItem)
    })
  }

  it('should return item', async () => {
    assert.equal(await FindItem(db)('collectionName', 'query'), mockItem)
  })

  it('should call findOne once', () => {
    assert(stubFindOne.calledOnce, 'findOne should be called once')
  })
})
