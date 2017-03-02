import InsertItem from './InsertItem'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('InsertItem', () => {
  it('should return object of item inserted', async () => {
    const stubInsertOne = sinon.stub()
    const db = {
      collection: () => ({
        insertOne: stubInsertOne.returns({ ops: 'hello' })
      })
    }

    assert.equal(await InsertItem(db)('collectionName', 'query'), 'hello')
    assert(stubInsertOne.calledOnce, 'insertOne should be called once')
  })
})
