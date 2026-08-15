import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { CoreRoleModel } from '#shared/framework/infra/db/models/index'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import { FindRoleBySlugRepository } from '#modules/admin/settings/acl/roles_management/usecases/index'

export class FindRoleBySlugRepositoryImpl implements FindRoleBySlugRepository {
  constructor(private readonly roleMapper: RoleMapper) {}
  async find(slug: string): Promise<RoleEntity | undefined> {
    const roleModel = await CoreRoleModel.query().preload('permissions').where('slug', slug).first()

    if (!roleModel) {
      return
    }

    return this.roleMapper.toDomain(roleModel)
  }
}
