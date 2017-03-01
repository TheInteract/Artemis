import withMongodb from './withMongodb'
import FindItemCommand from './commands/FindItem'

export const findItem = withMongodb(FindItemCommand)
