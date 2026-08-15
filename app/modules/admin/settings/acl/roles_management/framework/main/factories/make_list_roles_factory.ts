import { ListRolesController } from '../controllers/view_roles_controller.js'
import { ListRolesUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/list_roles/list_roles_usecase_impl'
import { ListRolesRepositoryImpl } from '#modules/admin/settings/acl/roles_management/framework/infra/db/repositories/list_roles_repository_impl'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'

export const makeListRolesFactory = (): ListRolesController => {
  return new ListRolesController(
    new ListRolesUseCaseImpl(new ListRolesRepositoryImpl(), new DateAdapterImpl())
  )
}
