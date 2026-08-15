import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { FindUsernameRepository } from '#modules/auth/usecases/index'
import { UserMapper } from '../mappers/user_mapper.js'

export class FindUsernameRepositoryImpl implements FindUsernameRepository {
  constructor(private readonly userMapper: UserMapper = new UserMapper()) {}

  async findUsername(username: string): Promise<UserEntity | undefined> {
    const user = await CoreUserModel.query().preload('role').where('slug', username).first()

    if (!user) {
      return
    }

    return this.userMapper.toDomain(user)
  }
}
