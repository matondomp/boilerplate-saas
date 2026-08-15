import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { UserMapper } from '../mappers/user_mapper.js'
import { UniqueEntityID } from '#core/domain/index'
import { FindUserIdRepository } from '#shared/usecases/ports/find_user_id_repository'

export class FindUserIdRepositoryImpl implements FindUserIdRepository {
  constructor(private readonly userMapper: UserMapper = new UserMapper()) {}

  async findUserId(userId: UniqueEntityID): Promise<UserEntity | undefined> {
    const user = await CoreUserModel.query().preload('role').where('id', userId.toString()).first()

    if (!user) {
      return
    }

    return this.userMapper.toDomain(user)
  }
}
