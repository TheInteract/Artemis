const findItem = db => async (collectionName, query) => {
  return await db.collection(collectionName).findOne(query)
}

export default findItem
