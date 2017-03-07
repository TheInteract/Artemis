import CountItemsCommand from './commands/CountItems'
import FindItemCommand from './commands/FindItem'
import FindItemsCommand from './commands/FindItems'
import InsertItemCommand from './commands/InsertItem'
import withMongodb from './withMongodb'

export const findItem = withMongodb(FindItemCommand)
export const findItems = withMongodb(FindItemsCommand)
export const insertItem = withMongodb(InsertItemCommand)
export const countItems = withMongodb(CountItemsCommand)
