import { EventDispatcher } from '#core/domain/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { UserMapper } from '#shared/framework/infra/db/mappers/index'
import { UploadServiceLocalImpl } from '#shared/framework/infra/services/upload_service_local_impl'
import {
  FindUserIdRepositoryImpl,
  UpdateUserRepositoryImpl,
} from '#modules/auth/framework/infra/db/repositories/index'
import { UpdateUserInfoUseCaseImpl } from '../../../usecases/index.js'
import { UpdateUserInfoController } from '../controllers/update_user_info/index.js'

export const makeUpdateUserInfoControllerFactory = (): UpdateUserInfoController => {
  const userMapper = new UserMapper(new DateAdapterImpl())

  return new UpdateUserInfoController(
    new UploadServiceLocalImpl(),
    new UpdateUserInfoUseCaseImpl(
      new FindUserIdRepositoryImpl(userMapper),
      new UpdateUserRepositoryImpl(userMapper),
      EventDispatcher.getInstance()
    )
  )
}
