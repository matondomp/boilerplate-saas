import { EventDispatcher } from '#core/domain/index'
import {
  FindUsernameEmailRepositoryImpl,
  FindUsernameRepositoryImpl,
  UpdateUserRepositoryImpl,
} from '#shared/framework/infra/index'
import { UpdateUserUseCaseImpl } from '../../../usecases/index.js'
import { UpdateUserController } from '../controllers/update_user_controller.js'

export const makeUpdateUserControllerFactory = (): UpdateUserController => {
  return new UpdateUserController(
    new UpdateUserUseCaseImpl(
      new FindUsernameRepositoryImpl(),
      new UpdateUserRepositoryImpl(),
      new FindUsernameEmailRepositoryImpl(),
      EventDispatcher.getInstance()
    )
  )
}
