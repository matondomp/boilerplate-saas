import Factory from '@adonisjs/lucid/factories'
import { StatusEnum } from '#shared/domain/types/index'
import { CoreRoleModel, CoreUserModel } from '#shared/framework/infra/index'

export const RoleFactory = Factory.define(CoreRoleModel, ({ faker }) => ({
  name: faker.lorem.word(),
  isSystem: false,
  description: faker.lorem.words(),
})).build()

export const UserFactory = Factory.define(CoreUserModel, ({ faker }) => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  password: faker.internet.password(),
  statusId: StatusEnum.ACTIVE,
}))
  .relation('role', () => RoleFactory)
  .build()
