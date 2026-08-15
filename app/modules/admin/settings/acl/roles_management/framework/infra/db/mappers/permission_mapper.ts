import { Mapper, UniqueEntityID } from '#core/domain/index'
import { PermissionEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/permission_entity'
import { CorePermissionModel } from '#shared/framework/infra/db/models/index'

export class PermissionMapper implements Mapper<PermissionEntity, CorePermissionModel> {
  toDomain(permissionModel: CorePermissionModel): PermissionEntity {
    return PermissionEntity.hydrate(new UniqueEntityID(permissionModel.id), {
      group: permissionModel.group,
      name: permissionModel.display,
      description: permissionModel.description,
    })
  }
  toPersistence(
    _permissionEntity: PermissionEntity
  ): Promise<CorePermissionModel> | CorePermissionModel {
    throw new Error('toPersistence not implemented on PermissionMapper')
  }
}
