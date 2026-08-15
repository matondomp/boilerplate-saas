import { AuthenticateUserUseCase } from '#modules/auth/domain/usecases/index'
import { UserNotFoundError, PasswordMismatchError } from '#modules/auth/domain/errors/index'
import { IEventDispatcher, left, right } from '#core/domain/index'
import { FindUsernameRepository } from '#modules/auth/usecases/index'
import { VerifyPasswordMatchAdapter } from '#modules/auth/usecases/authenticate_user/ports/index'
import { UserLoggedEvent } from '#modules/auth/domain/events/user_logged_event'

export class AuthenticateUserUseCaseImpl implements AuthenticateUserUseCase.Contract {
  constructor(
    private readonly findUsernameRepository: FindUsernameRepository,
    private readonly verifyPasswordMatchAdapter: VerifyPasswordMatchAdapter,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: AuthenticateUserUseCase.Input): Promise<AuthenticateUserUseCase.Output> {
    const user = await this.findUsernameRepository.findUsername(input.username)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const result = await this.verifyPasswordMatchAdapter.compare(user.password, input.password)

    if (!result) {
      this.eventDispatcher.publish(
        new UserLoggedEvent({
          userId: user.id,
          success: false,
          errorMessage: new PasswordMismatchError(),
        })
      )

      return left(new PasswordMismatchError())
    }

    this.eventDispatcher.publish(
      new UserLoggedEvent({
        userId: user.id,
        success: true,
      })
    )

    return right({
      userId: user.id.toString(),
    })
  }
}
