import { UserEntity } from '#modules/auth/domain/index'
import { UserMapper } from '#shared/framework/infra/db/mappers/user_mapper'
import { UpdateUserRepository } from '#modules/auth/usecases/reset_password/ports/index'

export class UpdateUserRepositoryImpl implements UpdateUserRepository {
  constructor(private readonly userMapper: UserMapper = new UserMapper()) {}
  async update(user: UserEntity): Promise<void> {
    const userModel = await this.userMapper.toPersistence(user)

    await userModel.save()
  }
}
