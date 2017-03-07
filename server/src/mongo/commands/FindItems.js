const findItem = db => async (collectionName, query) =>
  await db.collection(collectionName).find(query).toArray()

export default findItem
