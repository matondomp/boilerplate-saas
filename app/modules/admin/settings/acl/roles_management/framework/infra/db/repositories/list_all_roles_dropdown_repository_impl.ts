import { CoreRoleModel } from '#shared/framework/infra/db/models/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { ListAllRolesRepository } from '#modules/admin/settings/acl/roles_management/usecases/list_roles_dropdown/props/index'
import { ListRolesDropdownUseCaseInput } from '#modules/admin/settings/acl/roles_management/domain/usecases/list_roles_dropdown/index'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'

export class ListAllRolesDropdownRepositoryImpl implements ListAllRolesRepository {
  constructor(private readonly roleMapper: RoleMapper = new RoleMapper()) {}

  async findAll(input: ListRolesDropdownUseCaseInput): Promise<RoleEntity[]> {
    const rolesPaginated = await CoreRoleModel.query()
      .preload('permissions')
      .whereNull('deleted_at')
      .andWhere((q) => {
        if (!input.isRoot) {
          q.whereNot('slug', 'root')
        }
      })
      .exec()

    return rolesPaginated.map(this.roleMapper.toDomain)
  }
}
