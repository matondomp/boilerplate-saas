import { Either, IEventDispatcher, left, right } from '#core/domain/index'
import { UserNotFoundError } from '#shared/domain/errors/index'
import { RootUserCannotBeModified } from '../../domain/errors/index.js'
import { UserBlockedEvent } from '../../domain/events/user_blocked_event.js'
import { BlockUserUseCase, BlockUserUseCaseInput } from './../../domain/index.js'
import { FindUsernameRepository, UpdateUserRepository } from './ports/index.js'

export class BlockUserUseCaseImpl implements BlockUserUseCase {
  constructor(
    private readonly findUserNameRepository: FindUsernameRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(
    input: BlockUserUseCaseInput
  ): Promise<Either<UserNotFoundError | RootUserCannotBeModified, boolean>> {
    const userEntity = await this.findUserNameRepository.findUsername(input.username)

    if (!userEntity) {
      return left(new UserNotFoundError())
    }

    if (userEntity.isRoot) {
      return left(new RootUserCannotBeModified())
    }

    userEntity.block()

    await this.updateUserRepository.update(userEntity)

    this.eventDispatcher.publish(
      new UserBlockedEvent({
        userId: userEntity.id,
      })
    )

    return right(true)
  }
}
