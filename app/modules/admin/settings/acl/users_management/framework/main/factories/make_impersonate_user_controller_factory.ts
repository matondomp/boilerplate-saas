import { ImpersonateUserUseCaseImpl } from './../../../usecases/impersonate_user/impersonate_user_usecase_impl.js'
import { UserRoleMapper } from '#shared/framework/infra/db/mappers/index'
import { FindUsernameWithRoleRepositoryImpl } from '../../infra/db/repositories/find_username_with_role_repository_impl.js'
import { ImpersonateUserController } from '../controllers/impersonate_user_controller.js'
import { EventDispatcher } from '#core/domain/index'

export const makeImpersonateControllerFactory = (): ImpersonateUserController => {
  return new ImpersonateUserController(
    new ImpersonateUserUseCaseImpl(
      new FindUsernameWithRoleRepositoryImpl(new UserRoleMapper()),
      EventDispatcher.getInstance()
    )
  )
}
