import {
  UpdateUserInfoUseCase,
  UpdateUserInfoUseCaseInput,
  UserInfoUpdatedEvent,
  UserInfoUpdatedProps,
} from '../../domain/index.js'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { FindUserIdRepository, UpdateUserRepository } from './ports/index.js'
import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'

export class UpdateUserInfoUseCaseImpl implements UpdateUserInfoUseCase {
  constructor(
    private readonly findUserIdRepository: FindUserIdRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: UpdateUserInfoUseCaseInput): Promise<Either<UserNotFoundError, boolean>> {
    const userEntity = await this.findUserIdRepository.findUserId(new UniqueEntityID(input.userId))

    if (!userEntity) {
      return left(new UserNotFoundError())
    }

    const eventProps: UserInfoUpdatedProps = {
      old: {
        avatarUrl: userEntity.avatar,
        firstName: userEntity.firstName,
        lastName: userEntity.lastName,
        timezone: userEntity.timezone,
        defaultLang: userEntity.defaultLang,
      },
      new: {
        avatarUrl: input.avatarUrl,
        firstName: input.firstName,
        lastName: input.lastName,
        timezone: input.timezone ?? userEntity.timezone,
        defaultLang: input.defaultLang ?? userEntity.defaultLang,
      },
    }

    if (input.avatarUrl) {
      userEntity.changeAvatar(input.avatarUrl)
    }

    userEntity.changeFirstName(input.firstName)
    userEntity.changeLastName(input.lastName)

    if (input.timezone) {
      userEntity.changeTimezone(input.timezone)
    }

    if (input.defaultLang) {
      userEntity.changeLanguage(input.defaultLang)
    }

    const userValidationError = userEntity.validate()

    if (userValidationError.isLeft()) {
      return left(userValidationError.value)
    }

    await this.updateUserRepository.update(userEntity)

    this.eventDispatcher.publish(new UserInfoUpdatedEvent(eventProps))
    return right(true)
  }
}
