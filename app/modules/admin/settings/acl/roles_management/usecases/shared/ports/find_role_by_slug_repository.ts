import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'

export interface FindRoleBySlugRepository {
  find(roleSlug: string): Promise<RoleEntity | undefined>
}
