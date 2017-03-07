const InsertItem = db => async (collectionName, query) =>
  await db.collection(collectionName).insertOne(query).ops

export default InsertItem
