import * as Cookie from '../cookies/Cookie'

import InvalidArgumentError from '../errors/InvalidArgumentError'
import UnauthorizedError from '../errors/UnauthorizedError'
import _ from 'lodash'
import logger from 'winston'

export const validate = code => {
  const key = _.split(code, ':', 2)[0]
  const result = Cookie.validate(key, code)

  if (result) {
    logger.info('device code is valid:', { code })
  } else {
    logger.warn('device code is invalid', { code })
  }

  return result
}

export const authorized = code => {
  if (!code) throw new InvalidArgumentError()

  const key = _.split(code, ':', 2)[0]
  // TODO: check Cookie from database
  if (!Cookie.validate(key, code)) throw new UnauthorizedError()
  return true
}
