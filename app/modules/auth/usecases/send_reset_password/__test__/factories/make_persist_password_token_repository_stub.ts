import { PersistResetPasswordTokenRepository } from '#modules/auth/usecases/index'
import { UniqueEntityID } from '#core/domain/index'

export const makePersistPasswordTokenRepositoryStub = (): PersistResetPasswordTokenRepository => {
  return new (class implements PersistResetPasswordTokenRepository {
    async persist(_userId: UniqueEntityID, _hash: string): Promise<void> {}
  })()
}
