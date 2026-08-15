import { CreateRoleController } from '../controllers/create_role_controller.js'
import { CreateRoleUseCaseImpl } from '#modules/admin/settings/acl/roles_management/usecases/create_role/create_role_usecase_impl'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import {
  FindRoleByNameRepositoryImpl,
  CreateRoleWithTransactionRepositoryImpl,
} from '#modules/admin/settings/acl/roles_management/framework/infra/db/index'
import { EventDispatcher } from '#core/domain/index'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'

export const makeCreateRoleControllerFactory = (): CreateRoleController => {
  const roleMapper = new RoleMapper()

  return new CreateRoleController(
    new CreateRoleUseCaseImpl(
      new FindRoleByNameRepositoryImpl(roleMapper),
      new CreateRoleWithTransactionRepositoryImpl(roleMapper),
      new TransactionAdapterImpl(),
      EventDispatcher.getInstance()
    )
  )
}
