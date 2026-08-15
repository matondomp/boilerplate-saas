import { AuthenticateUserUseCaseImpl } from '#modules/auth/usecases/index'
import { VerifyPasswordMatchAdapterImpl } from '#modules/auth/framework/infra/adapters/index'
import { EventDispatcher } from '#core/domain/index'
import { FindUserToAuthenticateRepositoryImpl } from '#modules/auth/framework/infra/db/repositories/find_user_to_authenticate_repository_impl'
import { SignInViewController } from '../../controllers/sign_in/view_session_controller.js'
export const makeSignInViewController = (): SignInViewController =>
  new SignInViewController(
    new AuthenticateUserUseCaseImpl(
      new FindUserToAuthenticateRepositoryImpl(),
      new VerifyPasswordMatchAdapterImpl(),
      EventDispatcher.getInstance()
    )
  )
