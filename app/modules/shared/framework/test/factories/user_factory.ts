import Factory from '@adonisjs/lucid/factories'
import { StatusEnum } from '#shared/domain/types/index'
import { CorePermissionModel, CoreRoleModel, CoreUserModel } from '#shared/framework/infra/index'

export const PermissionFactory = Factory.define(CorePermissionModel, ({ faker }) => ({
  id: faker.string.uuid(),
  description: faker.lorem.words(),
  display: faker.lorem.word(),
  internal: false,
}))

export const RoleFactory = Factory.define(CoreRoleModel, ({ faker }) => ({
  name: faker.internet.userName(),
  isSystem: false,
  description: faker.word.words(),
}))
  .relation('permissions', () => PermissionFactory)
  .build()

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
