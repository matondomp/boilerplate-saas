import { EventDispatcher } from '#core/domain/index'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'
import { RoleMapper, UserMapper } from '#shared/framework/infra/db/mappers/index'
import { DeleteBulkRolesUseCaseImpl } from '../../../usecases/index.js'
import {
  DeleteBulkRolesWithTransactionRespositoryImpl,
  FindAssociatedUsersToRoleRepositoryImpl,
  FindRoleBySlugRepositoryImpl,
} from '../../infra/index.js'
import { DeleteBulkRolesController } from '../controllers/delete_bulk_roles_controller.js'

export const makeDeleteBulkControllerFactory = (): DeleteBulkRolesController => {
  return new DeleteBulkRolesController(
    new DeleteBulkRolesUseCaseImpl(
      new TransactionAdapterImpl(),
      new FindAssociatedUsersToRoleRepositoryImpl(new UserMapper()),
      new FindRoleBySlugRepositoryImpl(new RoleMapper()),
      new DeleteBulkRolesWithTransactionRespositoryImpl(),
      EventDispatcher.getInstance()
    )
  )
}
