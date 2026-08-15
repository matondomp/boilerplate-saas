import { Pagination } from '#core/ports/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { ListRolesUseCaseInput } from '#modules/admin/settings/acl/roles_management/domain/index'

export interface ListRolesRepository {
  findAll(input: ListRolesUseCaseInput): Promise<Pagination<RoleEntity>>
}
