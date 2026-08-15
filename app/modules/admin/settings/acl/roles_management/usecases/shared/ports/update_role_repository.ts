import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'

export interface UpdateRoleRepository {
  update(roleEntity: RoleEntity): Promise<void>
}
