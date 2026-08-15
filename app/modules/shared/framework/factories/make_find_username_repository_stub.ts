import { FindUsernameRepository } from '#modules/auth/usecases/index'
import { UserEntity, UserProps } from '#shared/domain/entities/user_entity'
import { UniqueEntityID } from '#core/domain/index'
import { Email } from '#shared/domain/value_objects/email'
import { StatusEnum } from '#shared/domain/types/index'
import { UserRoleAggregate } from '#shared/domain/aggregates/user_role_aggregate'
import { RoleEntity, RoleProps } from '#shared/domain/entities/role_entity'
import { FindUsernameWithRoleRepository } from '#shared/usecases/ports/find_username_with_role_repository'

export const makeFindUsernameRepositoryStub = (): FindUsernameRepository => {
  return new (class implements FindUsernameRepository {
    async findUsername(_username: string): Promise<UserEntity | undefined> {
      const email = Email.create('valid@email.com')

      if (email.isLeft()) {
        throw new Error()
      }

      const userEntity = UserEntity.hydrate(new UniqueEntityID('valid_id'), {
        email: email.value,
        password: 'valid_password',
        firstName: 'valid',
        lastName: 'user',
        status: StatusEnum.ACTIVE,
        timezone: 'unknow',
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

export const makeFindUserWithRoleRepositoryStub = (
  userProps?: Partial<UserProps>,
  roleProps?: Partial<RoleProps>
): FindUsernameWithRoleRepository => {
  return new (class implements FindUsernameWithRoleRepository {
    async findUsername(_username: string): Promise<UserRoleAggregate | undefined> {
      const email = Email.create('valid@email.com')

      if (email.isLeft()) {
        throw new Error()
      }

      const userEntity = UserEntity.hydrate(
        new UniqueEntityID('valid_id'),
        Object.assign(
          {
            email: email.value,
            password: 'valid_password',
            firstName: 'valid',
            lastName: 'user',
            status: StatusEnum.ACTIVE,
            defaultLang: 'pt',
            timezone: 'unknow',
            roleId: new UniqueEntityID('valid_role_id'),
          },
          userProps || {}
        )
      )

      if (userEntity.isLeft()) {
        throw new Error(userEntity.value.errorMessage)
      }

      const roleEntity = RoleEntity.hydrate(
        new UniqueEntityID('valid_role_id'),
        Object.assign(
          {
            slug: 'valid_role',
            name: 'Valid role',
            permissions: [],
            description: 'Valid Role',
          },
          roleProps || {}
        )
      )

      return UserRoleAggregate.hydrate({
        user: userEntity.value,
        role: roleEntity,
      })
    }
  })()
}
