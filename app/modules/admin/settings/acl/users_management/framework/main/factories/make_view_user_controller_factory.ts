import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { UserRoleMapper } from '#shared/framework/infra/db/mappers/index'
import { FindUserUseCaseImpl } from '../../../usecases/index.js'
import { FindUsernameWithRoleRepositoryImpl } from '../../infra/db/repositories/find_username_with_role_repository_impl.js'
import { ViewUserController } from '../controllers/view_user_controller.js'

export const makeViewUserControllerFactory = (): ViewUserController => {
  return new ViewUserController(
    new FindUserUseCaseImpl(
      new FindUsernameWithRoleRepositoryImpl(new UserRoleMapper()),
      new DateAdapterImpl()
    )
  )
}
