import { ListUsersController } from '../controllers/view_users_controller.js'
import { ListUsersUseCaseImpl } from '#modules/admin/settings/acl/users_management/usecases/list_users/list_users_usecase_impl'
import { ListUsersRepositoryImpl } from '#modules/admin/settings/acl/users_management/framework/infra/db/repositories/list_users_repository_impl'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'

export const makeListUsersFactory = (): ListUsersController => {
  return new ListUsersController(
    new ListUsersUseCaseImpl(new ListUsersRepositoryImpl(), new DateAdapterImpl())
  )
}
