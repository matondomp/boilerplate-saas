import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'

export interface FindRoleByNameRepository {
  findByName: (name: string) => Promise<RoleEntity | undefined>
}
