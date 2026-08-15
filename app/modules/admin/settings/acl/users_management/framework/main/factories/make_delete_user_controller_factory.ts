import { EventDispatcher } from '#core/domain/index'

import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { FindUsernameRepositoryImpl, UpdateUserRepositoryImpl } from '#shared/framework/infra/index'

import { DeleteUserController } from '../controllers/delete_user_controller.js'
import { DeleteUserUseCaseImpl } from '../../../usecases/index.js'

export const makeDeleteUserControllerFactory = (): DeleteUserController => {
  const userMapper = new UserMapper(new DateAdapterImpl())

  return new DeleteUserController(
    new DeleteUserUseCaseImpl(
      new FindUsernameRepositoryImpl(userMapper),
      new UpdateUserRepositoryImpl(userMapper),
      EventDispatcher.getInstance()
    )
  )
}
