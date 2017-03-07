import config from 'config'
import crypto from 'crypto'
import logger from 'winston'

export const generate = (key = new Date().getTime()) => {
  const hash = crypto.createHmac('sha512', config.get('secret.key'))
    .update(String(key))
  const token = hash.digest('hex')

  const code = `${key}:${token}`
  logger.info('generated code:', { code })
  return code
}

export const validate = (key, value) => generate(key) === value
