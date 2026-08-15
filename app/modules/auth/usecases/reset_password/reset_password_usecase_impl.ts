import { ResetPasswordUseCase } from '#modules/auth/domain/usecases/index'
import {
  FindTokenRepository,
  FindUserIdRepository,
  UpdateTokenRepository,
  UpdateUserRepository,
} from './ports/index.js'
import { EventDispatcher, left, right } from '#core/domain/index'
import {
  TokenExpiredError,
  TokenNotFoundError,
  TokenRevokedError,
  UserNotFoundError,
} from '#modules/auth/domain/errors/index'
import { TokenEntity } from '#modules/auth/domain/index'
import { PasswordChangedEvent } from '#shared/domain/events/password_changed_event'

export class ResetPasswordUseCaseImpl implements ResetPasswordUseCase.Contract {
  constructor(
    private readonly findTokenRepository: FindTokenRepository,
    private readonly findUserIdRepository: FindUserIdRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly updateTokenRepository: UpdateTokenRepository,
    private readonly eventEmitter: EventDispatcher
  ) {}

  private validateToken(token: TokenEntity): ResetPasswordUseCase.Output {
    if (token.isExpired) {
      return left(new TokenExpiredError())
    }

    if (token.isRevoked) {
      return left(new TokenRevokedError())
    }

    return right(true)
  }

  async perform(input: ResetPasswordUseCase.Input): Promise<ResetPasswordUseCase.Output> {
    const token = await this.findTokenRepository.find(input.token)

    if (!token) {
      return left(new TokenNotFoundError())
    }

    const validateTokenResult = this.validateToken(token)

    if (validateTokenResult.isLeft()) {
      return left(validateTokenResult.value)
    }

    const user = await this.findUserIdRepository.findUserId(token.userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const passwordUpdated = user.changePassword(input.password, input.confirmPassword)

    if (passwordUpdated.isLeft()) {
      return left(passwordUpdated.value)
    }

    await this.updateUserRepository.update(user)

    token.revoke()
    await this.updateTokenRepository.update(token)

    this.eventEmitter.publish(
      new PasswordChangedEvent({
        userId: user.id,
      })
    )

    return right(true)
  }
}
