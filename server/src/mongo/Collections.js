import withMongodb from './withMongodb'
import FindItemCommand from './commands/FindItem'
import InsertItemCommand from './commands/InsertItem'

export const findItem = withMongodb(FindItemCommand)
export const insertItem = withMongodb(InsertItemCommand)
