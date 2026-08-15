import { EventDispatcher } from '#core/domain/index'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import { UpdateRoleUseCaseImpl } from '../../../usecases/index.js'
import {
  FindRoleBySlugRepositoryImpl,
  UpdateRoleWithTransactionRepositoryImpl,
} from '../../infra/index.js'
import { UpdateRoleController } from '../controllers/update_role_controller.js'

export const makeUpdateRoleControllerFactory = (): UpdateRoleController => {
  return new UpdateRoleController(
    new UpdateRoleUseCaseImpl(
      new FindRoleBySlugRepositoryImpl(new RoleMapper()),
      new UpdateRoleWithTransactionRepositoryImpl(new RoleMapper()),
      new TransactionAdapterImpl(),
      EventDispatcher.getInstance()
    )
  )
}
