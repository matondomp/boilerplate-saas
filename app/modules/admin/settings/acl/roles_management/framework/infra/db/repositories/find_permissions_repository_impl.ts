import { FindPermissionsRepository } from '#modules/admin/settings/acl/roles_management/usecases/find_permissions/ports/index'
import { PermissionEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/permission_entity'
import { PermissionMapper } from '#modules/admin/settings/acl/roles_management/framework/infra/db/mappers/permission_mapper'
import { CorePermissionModel } from '#shared/framework/infra/db/models/index'

export class FindPermissionsRepositoryImpl implements FindPermissionsRepository {
  constructor(private readonly permissionMapper: PermissionMapper) {}

  async findAll(isRoot: boolean): Promise<PermissionEntity[]> {
    const permissions = await CorePermissionModel.query()
      .where((q) => {
        if (!isRoot) {
          q.whereNot('internal', true)
        }
      })
      .exec()

    return permissions.map(this.permissionMapper.toDomain)
  }
}
