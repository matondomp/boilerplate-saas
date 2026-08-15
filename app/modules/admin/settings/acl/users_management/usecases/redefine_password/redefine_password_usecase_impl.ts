import { IEventDispatcher, Either, left, right } from '#core/domain/index'
import { UserNotFoundError, UserInactiveError } from '#shared/domain/errors/index'
import { RedefinePasswordUseCase, RedefinePasswordUseCaseInput } from '../../domain/index.js'
import { UserPasswordRestoredEvent } from '../../domain/events/user_password_restored_event.js'
import { FindUsernameRepository, UpdateUserRepository } from '../block_user/index.js'
import { GenerateRandomPasswordService } from '../create_user/index.js'

export class RedefinePasswordUseCaseImpl implements RedefinePasswordUseCase {
  constructor(
    private readonly findUserNameRepository: FindUsernameRepository,
    private readonly generateRandomPasswordService: GenerateRandomPasswordService,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(
    input: RedefinePasswordUseCaseInput
  ): Promise<Either<UserNotFoundError | UserInactiveError, string>> {
    const userEntity = await this.findUserNameRepository.findUsername(input.username)

    if (!userEntity) {
      return left(new UserNotFoundError())
    }

    if (userEntity.isInactive) {
      return left(new UserInactiveError())
    }

    const newPassword = await this.generateRandomPasswordService.generate(userEntity.slug)

    userEntity.changePassword(newPassword, newPassword)

    await this.updateUserRepository.update(userEntity)

    this.eventDispatcher.publish(
      new UserPasswordRestoredEvent({
        userId: userEntity.id,
      })
    )

    return right(newPassword)
  }
}
