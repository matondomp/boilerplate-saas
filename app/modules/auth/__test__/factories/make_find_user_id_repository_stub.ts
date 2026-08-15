import { UserEntity } from '#shared/domain/entities/user_entity'
import { UniqueEntityID } from '#core/domain/unique_entity_id'
import { FindUserIdRepository } from '#shared/usecases/ports/find_user_id_repository'
import { Email } from '#shared/domain/value_objects/email'
import { StatusEnum } from '#shared/domain/types/status_type'

export const makeFindUserIdRepositoryStub = (): FindUserIdRepository => {
  return new (class implements FindUserIdRepository {
    async findUserId(id: UniqueEntityID): Promise<UserEntity | undefined> {
      const email = Email.create('valid_user_id@email.com')

      if (email.isLeft()) {
        throw new Error()
      }

      const userEntity = UserEntity.hydrate(id, {
        email: email.value,
        password: 'valid_password',
        firstName: 'valid',
        lastName: 'user',
        timezone: 'unknown',
        status: StatusEnum.ACTIVE,
        defaultLang: 'pt',
        roleId: new UniqueEntityID('valid_role_id'),
      })

      if (userEntity.isLeft()) {
        throw new Error(userEntity.value.errorMessage)
      }

      return userEntity.value
    }
  })()
}
