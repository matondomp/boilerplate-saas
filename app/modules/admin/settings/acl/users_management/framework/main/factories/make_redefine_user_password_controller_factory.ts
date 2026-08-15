import { EventDispatcher } from '#core/domain/index'

import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { FindUsernameRepositoryImpl, UpdateUserRepositoryImpl } from '#shared/framework/infra/index'

import { RedefinePasswordUseCaseImpl } from '../../../usecases/index.js'
import { RedefineUserPasswordController } from '../controllers/redefine_user_password_controller.js'
import { GenerateRandomPasswordServiceImpl } from '../../infra/services/generate_random_password_service.js'

export const makeRedefineUserPasswordControllerFactory = (): RedefineUserPasswordController => {
  const userMapper = new UserMapper(new DateAdapterImpl())

  return new RedefineUserPasswordController(
    new RedefinePasswordUseCaseImpl(
      new FindUsernameRepositoryImpl(userMapper),
      new GenerateRandomPasswordServiceImpl(),
      new UpdateUserRepositoryImpl(userMapper),
      EventDispatcher.getInstance()
    )
  )
}
