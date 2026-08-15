import { FindRoleByNameRepository } from '#modules/admin/settings/acl/roles_management/usecases/create_role/ports/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { CoreRoleModel } from '#shared/framework/infra/db/models/index'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'

export class FindRoleByNameRepositoryImpl implements FindRoleByNameRepository {
  constructor(private readonly roleMapper: RoleMapper) {}
  async findByName(name: string): Promise<RoleEntity | undefined> {
    const roleModel = await CoreRoleModel.query()
      .preload('permissions')
      .where('name', name)
      .andWhereNull('deletedAt')
      .first()

    if (!roleModel) {
      return
    }

    return this.roleMapper.toDomain(roleModel)
  }
}
