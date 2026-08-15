import { ListRolesDropdownUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/index'
import { ListAllRolesDropdownRepositoryImpl } from '#modules/admin/settings/acl/roles_management/framework/infra/index'
import { ListRolesDropdownControllerController } from '#modules/admin/settings/acl/roles_management/framework/main/controllers/index'

export const makeListDropdownRolesFactory = (): ListRolesDropdownControllerController => {
  return new ListRolesDropdownControllerController(
    new ListRolesDropdownUseCaseImpl(new ListAllRolesDropdownRepositoryImpl())
  )
}
