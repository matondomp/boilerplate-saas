import { EventDispatcher } from '#core/domain/index'
import {
  FindTokenRepositoryImpl,
  FindUserIdRepositoryImpl,
  UpdateUserRepositoryImpl,
} from '#modules/auth/framework/infra/db/repositories/index'
import { ResetPasswordUseCaseImpl } from '#modules/auth/usecases/index'
import { UserMapper } from '#shared/framework/infra/db/mappers/user_mapper'
import { TokenMapper } from '#modules/auth/framework/infra/db/mappers/token_mapper'
import { ResetPasswordController } from '#modules/auth/framework/main/controllers/reset_password_controller'
import { UpdateTokenRepositoryImpl } from '#modules/auth/framework/infra/db/repositories/update_token_repository_impl'

export const makeResetPasswordFactory = (): ResetPasswordController => {
  const tokenMapper = new TokenMapper()
  const userMapper = new UserMapper()

  return new ResetPasswordController(
    new ResetPasswordUseCaseImpl(
      new FindTokenRepositoryImpl(tokenMapper),
      new FindUserIdRepositoryImpl(userMapper),
      new UpdateUserRepositoryImpl(userMapper),
      new UpdateTokenRepositoryImpl(tokenMapper),
      EventDispatcher.getInstance()
    )
  )
}
