import { StatusEnum } from '#shared/domain/types/index'
import { Email } from '#shared/domain/value_objects/email'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { FindUsernameRepository } from '#modules/auth/usecases/index'
import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from '#modules/admin/settings/acl/users_management/domain/index'
import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import {
  GenerateRandomPasswordService,
  PersistUserRepository,
} from '#modules/admin/settings/acl/users_management/usecases/create_user/ports/index'
import { UserAlreadyExistError } from '#modules/admin/settings/acl/users_management/domain/errors/index'
import { UserCreatedEvent } from '#modules/admin/settings/acl/users_management/domain/events/user_created_event'

export class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(
    private readonly findUsernameRepository: FindUsernameRepository,
    private readonly generateRandomPasswordService: GenerateRandomPasswordService,
    private readonly persistUserRepository: PersistUserRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: CreateUserUseCaseInput): Promise<Either<UserAlreadyExistError, string>> {
    const emailOrError = Email.create(input.email)

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const userExist = await this.findUsernameRepository.findUsername(emailOrError.value.value)

    if (userExist && !userExist.isDeleted) {
      return left(new UserAlreadyExistError())
    }

    const userPayload = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: emailOrError.value,
      status: StatusEnum.ACTIVE,
      defaultLang: 'pt',
      timezone: 'Africa/Luanda',
      roleId: new UniqueEntityID(input.role),
      password: 'first_password',
    }

    let userEntityOrEntity = userExist
      ? UserEntity.hydrate(userExist.id, userPayload, {
          updatedAt: new Date(),
          deletedAt: undefined,
        })
      : UserEntity.create(userPayload)

    if (userEntityOrEntity.isLeft()) {
      return left(userEntityOrEntity.value)
    }

    const randomPassword = await this.generateRandomPasswordService.generate(
      userEntityOrEntity.value.email
    )

    userEntityOrEntity.value.changePassword(randomPassword, randomPassword)

    const userSlug = await this.persistUserRepository.persist(userEntityOrEntity.value)

    this.eventDispatcher.publish(
      new UserCreatedEvent({
        userId: userEntityOrEntity.value.id,
        password: randomPassword,
      })
    )

    return right(userSlug)
  }
}
