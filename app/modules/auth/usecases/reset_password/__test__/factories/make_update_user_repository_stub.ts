import { UpdateUserRepository } from '#modules/auth/usecases/reset_password/ports/index'
import { UserEntity } from '#modules/auth/domain/index'

export const makeUpdateUserRepositoryStub = (): UpdateUserRepository => {
  return new (class implements UpdateUserRepository {
    async update(_user: UserEntity): Promise<void> {
      // do nothing
    }
  })()
}
