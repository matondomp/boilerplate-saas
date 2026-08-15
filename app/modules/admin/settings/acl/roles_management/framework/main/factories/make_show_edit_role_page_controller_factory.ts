import { ShowEditRolePageController } from '#modules/admin/settings/acl/roles_management/framework/main/controllers/show_edit_role_page_controller'
import {
  FindPermissionsRepositoryImpl,
  FindRoleBySlugRepositoryImpl,
  GenerateUniqueIdAdapterImpl,
  PermissionMapper,
} from '#modules/admin/settings/acl/roles_management/framework/infra/index'
import { RoleMapper, UserMapper } from '#shared/framework/infra/db/mappers/index'
import { FindUserIdRepositoryImpl } from '#shared/framework/infra/db/repositories/find_user_id_repository_impl'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { FindPermissionsUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/find_permissions/find_permissions_usecase_impl'
import { FindRoleUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/index'

export const makeShowEditRolePageControllerFactory = (): ShowEditRolePageController => {
  return new ShowEditRolePageController(
    new FindPermissionsUseCaseImpl(
      new FindPermissionsRepositoryImpl(new PermissionMapper()),
      new GenerateUniqueIdAdapterImpl()
    ),
    new FindRoleUseCaseImpl(
      new FindRoleBySlugRepositoryImpl(new RoleMapper()),
      new FindUserIdRepositoryImpl(new UserMapper()),
      new DateAdapterImpl()
    )
  )
}
