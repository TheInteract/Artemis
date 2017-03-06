import * as Cookie from '../cookies/Cookie'
import * as Code from '../users/Code'

export const getUserCode = hashedUserId => hashedUserId ? {
  userCode: Cookie.generate(hashedUserId)
} : {}

export const getDeviceCode = deviceCode => Code.validate(deviceCode)
  ? deviceCode : Cookie.generate()
