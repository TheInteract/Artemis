import InsertItem from './InsertItem'
import chai from 'chai'
import sinon from 'sinon'

const assert = chai.assert

describe('InsertItem', () => {
  const mockItem = 'hello'
  const stubInsertOne = sinon.stub()
  const db = {
    collection: () => ({
      insertOne: stubInsertOne.returns({ ops: mockItem })
    })
  }

  it('should return object of item inserted', async () => {
    assert.equal(await InsertItem(db)('collectionName', 'query'), mockItem)
  })

  it('should call insertOne once', () => {
    assert(stubInsertOne.calledOnce, 'insertOne should be called once')
  })
})
