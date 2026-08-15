import { ShowCreateRolePageController } from '#modules/admin/settings/acl/roles_management/framework/main/controllers/show_create_role_page_controller'
import { FindPermissionsUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/find_permissions/find_permissions_usecase_impl'

import {
  PermissionMapper,
  FindPermissionsRepositoryImpl,
  GenerateUniqueIdAdapterImpl,
} from '#modules/admin/settings/acl/roles_management/framework/infra/index'

export const makeShowCreateRolePageControllerFactory = (): ShowCreateRolePageController => {
  return new ShowCreateRolePageController(
    new FindPermissionsUseCaseImpl(
      new FindPermissionsRepositoryImpl(new PermissionMapper()),
      new GenerateUniqueIdAdapterImpl()
    )
  )
}
