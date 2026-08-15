import { AuthenticateUserUseCaseImpl } from '#modules/auth/usecases/index'

import { VerifyPasswordMatchAdapterImpl } from '#modules/auth/framework/infra/adapters/index'

import { EventDispatcher } from '#core/domain/index'
import { FindUserToAuthenticateRepositoryImpl } from '#modules/auth/framework/infra/db/repositories/find_user_to_authenticate_repository_impl'
import { SignInApiController } from '../../controllers/sign_in/rest_api_controller.js'

export const makeSignApiInController = (): SignInApiController =>
  new SignInApiController(
    new AuthenticateUserUseCaseImpl(
      new FindUserToAuthenticateRepositoryImpl(),
      new VerifyPasswordMatchAdapterImpl(),
      EventDispatcher.getInstance()
    )
  )
