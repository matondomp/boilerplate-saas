import { EventDispatcher } from '#core/domain/index'

import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { FindUsernameRepositoryImpl, UpdateUserRepositoryImpl } from '#shared/framework/infra/index'

import { UnblockUserController } from '../controllers/unblock_user_controller.js'
import { UnblockBlockUserUseCaseImpl } from '../../../usecases/unblock_user/unblock_user_usecase_impl.js'

export const makeUnblockUserControllerFactory = (): UnblockUserController => {
  const userMapper = new UserMapper(new DateAdapterImpl())

  return new UnblockUserController(
    new UnblockBlockUserUseCaseImpl(
      new FindUsernameRepositoryImpl(userMapper),
      new UpdateUserRepositoryImpl(userMapper),
      EventDispatcher.getInstance()
    )
  )
}
