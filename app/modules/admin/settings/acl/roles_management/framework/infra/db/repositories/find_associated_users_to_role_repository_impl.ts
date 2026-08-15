import { FindAssociatedUsersRepository } from '#modules/admin/settings/acl/roles_management/usecases/index'
import { UniqueEntityID } from '#core/domain/index'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { CoreUserModel } from '#shared/framework/infra/db/models/index'

export class FindAssociatedUsersToRoleRepositoryImpl implements FindAssociatedUsersRepository {
  constructor(private readonly userMapper: UserMapper) {}

  async findAssociatedUsers(roleId: UniqueEntityID): Promise<UserEntity[]> {
    const users = await CoreUserModel.query()
      .where('roleId', roleId.toString())
      .andWhereNull('deleted_at')
      .exec()

    return users.map(this.userMapper.toDomain)
  }
}
