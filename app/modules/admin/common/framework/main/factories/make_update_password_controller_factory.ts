import { EventDispatcher } from '#core/domain/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { FindUserIdRepositoryImpl } from '#shared/framework/infra/db/repositories/find_user_id_repository_impl'
import { UpdateUserRepositoryImpl } from '#shared/framework/infra/db/repositories/update_user_repository_impl'
import { VerifyPasswordMatchAdapterImpl } from '#modules/auth/framework/infra/adapters/index'
import { UpdatePasswordUseCaseImpl } from '../../../usecases/update_password/index.js'
import { UpdatePasswordController } from '../controllers/update_password_controller.js'

export const makeUpdatePasswordControllerFactory = (): UpdatePasswordController => {
  return new UpdatePasswordController(
    new UpdatePasswordUseCaseImpl(
      new FindUserIdRepositoryImpl(new UserMapper(new DateAdapterImpl())),
      new UpdateUserRepositoryImpl(new UserMapper(new DateAdapterImpl())),
      new VerifyPasswordMatchAdapterImpl(),
      EventDispatcher.getInstance()
    )
  )
}
