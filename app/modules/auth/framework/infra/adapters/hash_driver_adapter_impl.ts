import crypto from 'node:crypto'
import { HashAdapter } from '#modules/auth/usecases/index'

export class HashDriverAdapterImpl implements HashAdapter {
  async generate(secret: string, payload: string): Promise<string> {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(`${payload}${new Date().getTime()}`)

    return hmac.digest('hex')
  }
}
