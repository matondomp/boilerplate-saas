import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { ListRolesDropdownUseCaseInput } from '#modules/admin/settings/acl/roles_management/domain/usecases/list_roles_dropdown/index'

export interface ListAllRolesRepository {
  findAll(input: ListRolesDropdownUseCaseInput): Promise<RoleEntity[]>
}
