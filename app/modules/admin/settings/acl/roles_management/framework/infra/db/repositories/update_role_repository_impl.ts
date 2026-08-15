import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import { UpdateRoleRepository } from '#modules/admin/settings/acl/roles_management/usecases/index'

export class UpdateRoleRepositoryImpl implements UpdateRoleRepository {
  constructor(private readonly roleMapper: RoleMapper) {}

  async update(roleEntity: RoleEntity): Promise<void> {
    const roleModel = await this.roleMapper.toPersistence(roleEntity)

    await roleModel.save()
  }
}
