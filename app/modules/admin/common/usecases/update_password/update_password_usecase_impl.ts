import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import { UserNotFoundError, NewPasswordMismatchError } from '#modules/auth/domain/index'
import { UpdateUserRepository, VerifyPasswordMatchAdapter } from './ports/index.js'
import {
  SamePasswordError,
  UpdatePasswordUseCase,
  UpdatePasswordUseCaseInput,
  WrongCurrentPasswordError,
} from '../../domain/index.js'
import { PasswordChangedEvent } from '#shared/domain/events/password_changed_event'
import { FindUserIdRepository } from '#shared/usecases/ports/find_user_id_repository'

export class UpdatePasswordUseCaseImpl implements UpdatePasswordUseCase {
  constructor(
    private readonly findUseIdRepository: FindUserIdRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly verifyPasswordMatchAdapter: VerifyPasswordMatchAdapter,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(
    input: UpdatePasswordUseCaseInput
  ): Promise<
    Either<UserNotFoundError | WrongCurrentPasswordError | NewPasswordMismatchError, boolean>
  > {
    const userEntity = await this.findUseIdRepository.findUserId(new UniqueEntityID(input.userId))

    if (!userEntity) {
      return left(new UserNotFoundError())
    }

    const verifyPasswordResult = await this.verifyPasswordMatchAdapter.compare(
      userEntity.password,
      input.passwordOptions.currentPassword
    )

    if (!verifyPasswordResult) {
      return left(new WrongCurrentPasswordError())
    }

    const samePasswordError = await this.verifyPasswordMatchAdapter.compare(
      userEntity.password,
      input.passwordOptions.newPassword
    )

    if (samePasswordError) {
      return left(new SamePasswordError())
    }

    const updatePasswordOrError = userEntity.changePassword(
      input.passwordOptions.newPassword,
      input.passwordOptions.confirmPassword
    )

    if (updatePasswordOrError.isLeft()) {
      return left(new NewPasswordMismatchError())
    }

    await this.updateUserRepository.update(userEntity)

    this.eventDispatcher.publish(
      new PasswordChangedEvent({
        userId: userEntity.id,
      })
    )

    return right(true)
  }
}
