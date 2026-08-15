import { UpdateTokenRepository } from '#modules/auth/usecases/reset_password/ports/index'
import { TokenEntity } from '#modules/auth/domain/index'

export const makeUpdateTokenRepositoryStub = (): UpdateTokenRepository => {
  return new (class implements UpdateTokenRepository {
    async update(_token: TokenEntity): Promise<void> {
      // do nothing
    }
  })()
}
