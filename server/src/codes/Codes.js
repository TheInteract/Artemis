import * as Cookie from '../cookies/Cookie'
import * as User from '../users/User'

export const getUserCode = hashedUserId => hashedUserId ? {
  userCode: Cookie.generate(hashedUserId)
} : {}

export const getDeviceCode = deviceCode => User.validateCode(deviceCode)
  ? deviceCode : Cookie.generate()
