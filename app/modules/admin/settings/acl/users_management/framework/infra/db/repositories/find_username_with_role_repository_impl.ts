import { StatusEnum } from '#modules/shared/domain/types/status_type'
import { UserRoleAggregate } from '#shared/domain/aggregates/user_role_aggregate'
import { UserRoleMapper } from '#shared/framework/infra/db/mappers/index'
import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { FindUsernameWithRoleRepository } from '../../../../usecases/index.js'

export class FindUsernameWithRoleRepositoryImpl implements FindUsernameWithRoleRepository {
  constructor(private readonly userRoleMapper: UserRoleMapper = new UserRoleMapper()) {}

  async findUsername(username: string): Promise<UserRoleAggregate | undefined> {
    const user = await CoreUserModel.query()
      .preload('role', (builder) => {
        builder.preload('permissions')
      })
      .where('slug', username)
      .andWhere((q) => {
        q.whereNull('deleted_at').andWhereNot('status_id', StatusEnum.DELETED)
      })
      .first()

    if (!user) {
      return
    }

    return this.userRoleMapper.toDomain(user)
  }
}
