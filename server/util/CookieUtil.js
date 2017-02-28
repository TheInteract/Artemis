import config from 'config'
import crypto from 'crypto'

export const generate = (key = new Date().getTime()) => {
  const hash = crypto.createHmac('sha512', config.get('secret.key'))
    .update(String(key))
  const token = hash.digest('hex')
  return `${key}:${token}`
}

export const validate = (key, value) => {
  return generate(key) === value
}
