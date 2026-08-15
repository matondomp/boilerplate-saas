import { IEventDispatcher, Either, left, right } from '#core/domain/index'
import { UserNotFoundError } from '#shared/domain/errors/index'
import { DeleteUserUseCase, DeleteUserUseCaseInput } from '../../domain/index.js'
import { RootUserCannotBeModified } from '../../domain/errors/index.js'
import { UserDeletedEvent } from '../../domain/events/user_deleted_event.js'
import { FindUsernameRepository, UpdateUserRepository } from '../block_user/index.js'

export class DeleteUserUseCaseImpl implements DeleteUserUseCase {
  constructor(
    private readonly findUserNameRepository: FindUsernameRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(
    input: DeleteUserUseCaseInput
  ): Promise<Either<UserNotFoundError | RootUserCannotBeModified, boolean>> {
    const userEntity = await this.findUserNameRepository.findUsername(input.username)

    if (!userEntity) {
      return left(new UserNotFoundError())
    }

    if (userEntity.isRoot) {
      return left(new RootUserCannotBeModified())
    }
    userEntity.delete()

    await this.updateUserRepository.update(userEntity)

    this.eventDispatcher.publish(
      new UserDeletedEvent({
        userId: userEntity.id,
        motivation: input.motivation,
      })
    )

    return right(true)
  }
}
