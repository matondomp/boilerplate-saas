import { EventDispatcher } from '#core/domain/index'

import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { FindUsernameRepositoryImpl, UpdateUserRepositoryImpl } from '#shared/framework/infra/index'

import { BlockUserController } from '../controllers/block_user_controller.js'
import { BlockUserUseCaseImpl } from '../../../usecases/block_user/block_user_usecase_impl.js'

export const makeBlockUserControllerFactory = (): BlockUserController => {
  const userMapper = new UserMapper(new DateAdapterImpl())

  return new BlockUserController(
    new BlockUserUseCaseImpl(
      new FindUsernameRepositoryImpl(userMapper),
      new UpdateUserRepositoryImpl(userMapper),
      EventDispatcher.getInstance()
    )
  )
}
