import FindItem from './FindItem'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('FindItem', () => {
  it('should return object of items', async () => {
    const stubFindOne = sinon.stub()
    const db = {
      collection: () => ({
        findOne: stubFindOne.returns('hello')
      })
    }

    assert.equal(await FindItem(db)('collectionName', 'query'), 'hello')
    assert(stubFindOne.calledOnce, 'findOne should be called once')
  })
})
