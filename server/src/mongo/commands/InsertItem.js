const InsertItem = db => async (collectionName, query) => {
  return await db.collection(collectionName).insertOne(query).ops
}

export default InsertItem
