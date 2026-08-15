import { DeleteRoleUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/index'
import { RoleMapper, UserMapper } from '#shared/framework/infra/db/mappers/index'
import { EventDispatcher } from '#core/domain/index'
import {
  FindAssociatedUsersToRoleRepositoryImpl,
  FindRoleBySlugRepositoryImpl,
  UpdateRoleRepositoryImpl,
} from '#modules/admin/settings/acl/roles_management/framework/infra/index'
import { DeleteRoleController } from '#modules/admin/settings/acl/roles_management/framework/main/controllers/delete_role_controller'

export const makeDeleteRoleFactory = (): DeleteRoleController => {
  return new DeleteRoleController(
    new DeleteRoleUseCaseImpl(
      new FindRoleBySlugRepositoryImpl(new RoleMapper()),
      new FindAssociatedUsersToRoleRepositoryImpl(new UserMapper()),
      new UpdateRoleRepositoryImpl(new RoleMapper()),
      EventDispatcher.getInstance()
    )
  )
}
