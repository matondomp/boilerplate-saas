import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import { FindUsernameRepository, UpdateUserRepository } from './ports/index.js'
import { UpdateUserErrors, UpdateUserUseCase, UpdateUserUseCaseInput } from '../../domain/index.js'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { Email } from '#shared/domain/value_objects/email'
import { UserUpdatedEvent, UserUpdatedProps } from '../../domain/events/user_updated_event.js'
import { UserAlreadyExistError } from '../../domain/errors/index.js'

export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  constructor(
    private readonly findUsernameRepository: FindUsernameRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly findUserActiveByEmailRepository: FindUsernameRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: UpdateUserUseCaseInput): Promise<Either<UpdateUserErrors, boolean>> {
    const user = await this.findUsernameRepository.findUsername(input.username)
    if (!user) {
      return left(new UserNotFoundError())
    }

    const eventProps: UserUpdatedProps = {
      userId: user.id,
      old: {
        fullName: user.fullName,
        email: user.email,
        roleId: new UniqueEntityID(user.roleId),
      },
      new: {
        fullName: user.fullName,
        email: user.email,
        roleId: new UniqueEntityID(user.roleId),
      },
    }

    user.changeFirstName(input.firstName)
    user.changeLastName(input.lastName)
    user.updatePermissions(new UniqueEntityID(input.role))

    if (user.email !== input.email) {
      const newEmail = Email.create(input.email)

      if (newEmail.isLeft()) {
        return left(newEmail.value)
      }

      user.alterEmail(newEmail.value)

      const olderUserWithSameEmail = await this.findUserActiveByEmailRepository.findUsername(
        user.email
      )

      if (olderUserWithSameEmail && !olderUserWithSameEmail.id.equals(user.id)) {
        return left(new UserAlreadyExistError())
      }
    }

    await this.updateUserRepository.update(user)

    eventProps.new = {
      fullName: user.fullName,
      email: user.email,
      roleId: new UniqueEntityID(user.roleId),
    }

    await this.eventDispatcher.publish(new UserUpdatedEvent(eventProps))
    return right(true)
  }
}
