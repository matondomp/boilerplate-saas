import { VerifyPasswordMatchAdapter } from '#modules/auth/usecases/index'
import hash from '@adonisjs/core/services/hash'

export class VerifyPasswordMatchAdapterImpl implements VerifyPasswordMatchAdapter {
  async compare(pwdHash: string, plain: string): Promise<boolean> {
    return await hash.verify(pwdHash, plain)
  }
}
