import { PermissionEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/permission_entity'

export interface FindPermissionsRepository {
  findAll(isRoot: boolean): Promise<PermissionEntity[]>
}
