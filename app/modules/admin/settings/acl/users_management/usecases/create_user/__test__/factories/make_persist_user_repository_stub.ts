import { PersistUserRepository } from '#modules/admin/settings/acl/users_management/usecases/create_user/ports/index'
import { UserEntity } from '#shared/domain/entities/user_entity'

export const makePersistUserRepositoryStub = (): PersistUserRepository => {
  return new (class implements PersistUserRepository {
    async persist(_user: UserEntity): Promise<string> {
      //
      return 'slug'
    }
  })()
}
