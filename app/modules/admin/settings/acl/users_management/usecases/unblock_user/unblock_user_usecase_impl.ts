import { Either, IEventDispatcher, left, right } from '#core/domain/index'
import { UserNotFoundError } from '#shared/domain/errors/index'
import { UnblockUserUseCase, UnblockUserUseCaseInput } from '../../domain/index.js'
import { FindUsernameRepository, UpdateUserRepository } from './ports/index.js'
import { UserRestoredEvent } from '../../domain/events/user_restored_event.js'

export class UnblockBlockUserUseCaseImpl implements UnblockUserUseCase {
  constructor(
    private readonly findUserNameRepository: FindUsernameRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: UnblockUserUseCaseInput): Promise<Either<UserNotFoundError, boolean>> {
    const userEntity = await this.findUserNameRepository.findUsername(input.username)

    if (!userEntity) {
      return left(new UserNotFoundError())
    }

    userEntity.restore()

    await this.updateUserRepository.update(userEntity)

    this.eventDispatcher.publish(
      new UserRestoredEvent({
        userId: userEntity.id,
      })
    )

    return right(true)
  }
}
