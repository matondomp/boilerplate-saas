import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { FindUsernameRepository } from '#modules/auth/usecases/index'
import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { StatusEnum } from '#shared/domain/types/index'

export class FindUserToAuthenticateRepositoryImpl implements FindUsernameRepository {
  constructor(private readonly userMapper: UserMapper = new UserMapper()) {}

  async findUsername(email: string): Promise<UserEntity | undefined> {
    const user = await CoreUserModel.query()
      .preload('role')
      .where({
        email,
        statusId: StatusEnum.ACTIVE,
      })
      .andWhereNull('deleted_at')
      .first()

    if (!user) {
      return
    }

    return this.userMapper.toDomain(user)
  }
}
