import { PersistUserRepository } from '#modules/admin/settings/acl/users_management/usecases/create_user/ports/index'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { UserMapper } from '#shared/framework/infra/db/mappers/user_mapper'

export class PersistUserRepositoryImpl implements PersistUserRepository {
  constructor(private readonly userMapper: UserMapper = new UserMapper()) {}

  async persist(user: UserEntity): Promise<string> {
    const userModel = await this.userMapper.toPersistence(user)

    await userModel.save()

    return userModel.slug
  }
}
