import { UniqueEntityID } from '#core/domain/index'
import { FindAssociatedUsersRepository } from '../../ports/find_associated_users_repository.js'
import { UserEntity } from '#modules/auth/domain/index'
import { Email } from '#shared/domain/value_objects/email'

export const makeFindAssociatedUsersRepositoryStub = (): FindAssociatedUsersRepository => {
  return new (class implements FindAssociatedUsersRepository {
    async findAssociatedUsers(_roleId: UniqueEntityID): Promise<UserEntity[]> {
      const emailOrError = Email.create('valid.user@test.com')

      if (emailOrError.isLeft()) {
        throw new Error(emailOrError.value.errorMessage)
      }

      const userOrError = UserEntity.hydrate(new UniqueEntityID('valid_user'), {
        firstName: 'valid',
        lastName: 'user',
        email: emailOrError.value,
        defaultLang: 'pt',
        password: 'string',
        timezone: 'unkonwn',
        roleId: new UniqueEntityID('valid_role'),
      })

      if (userOrError.isLeft()) {
        throw new Error(userOrError.value.errorMessage)
      }

      return [userOrError.value]
    }
  })()
}
