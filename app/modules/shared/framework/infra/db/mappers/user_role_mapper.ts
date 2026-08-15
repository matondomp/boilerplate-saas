import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { Mapper } from '#core/domain/index'
import { UserRoleAggregate } from '#shared/domain/aggregates/user_role_aggregate'
import { UserMapper } from '#shared/framework/infra/db/mappers/user_mapper'
import { RoleMapper } from '#shared/framework/infra/db/mappers/role_mapper'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'

export class UserRoleMapper extends Mapper<UserRoleAggregate, CoreUserModel> {
  constructor(
    private readonly userMapper: UserMapper = new UserMapper(new DateAdapterImpl()),
    private readonly roleMapper: RoleMapper = new RoleMapper()
  ) {
    super()
  }

  toDomain(userModel: CoreUserModel): UserRoleAggregate {
    const userEntity = this.userMapper.toDomain(userModel)

    const roleEntity = this.roleMapper.toDomain(userModel.role)

    return UserRoleAggregate.hydrate({ user: userEntity, role: roleEntity })
  }

  toPersistence(_userEntity: UserRoleAggregate): CoreUserModel {
    throw new Error('toPersistence on user-role-mapper not implemented!')
  }
}
