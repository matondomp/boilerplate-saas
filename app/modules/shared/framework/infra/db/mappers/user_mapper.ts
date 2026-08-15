import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { Mapper, UniqueEntityID } from '#core/domain/index'
import { UserEntity } from '#shared/domain/entities/user_entity'
import { Email } from '#shared/domain/value_objects/email'
import { StatusEnum } from '#shared/domain/types/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'

export class UserMapper extends Mapper<UserEntity, CoreUserModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {
    super()
  }

  toDomain(userModel: CoreUserModel): UserEntity {
    const emailOrError = Email.create(userModel.email)

    if (emailOrError.isLeft()) {
      throw new Error(emailOrError.value.errorMessage)
    }

    const userEntity = UserEntity.hydrate(
      new UniqueEntityID(userModel.id),
      {
        password: userModel.password,
        firstName: userModel.firstName,
        lastName: userModel.lastName,
        email: emailOrError.value,
        lastLoginAt: userModel.lastLoginAt?.toJSDate(),
        status: userModel.statusId,
        avatar: userModel.avatar,
        timezone: userModel.timezone,
        defaultLang: userModel.defaultLang,
        roleId: new UniqueEntityID(userModel.roleId),
        slug: userModel.slug,
      },
      {
        createdAt: userModel.createdAt.toJSDate(),
        updatedAt: userModel.updatedAt.toJSDate(),
        deletedAt: userModel.deletedAt ? userModel.deletedAt.toJSDate() : undefined,
      }
    )

    if (userEntity.isLeft()) {
      throw new Error(userEntity.value.errorMessage)
    }

    return userEntity.value
  }

  async toPersistence(userEntity: UserEntity): Promise<CoreUserModel> {
    let userModel: CoreUserModel = new CoreUserModel()
    userModel.id = userEntity.id.toString()

    const user = await CoreUserModel.findBy('id', userEntity.id.toString())

    if (user) {
      userModel = user
    }

    userModel.email = userEntity.email
    userModel.password = userEntity.password
    userModel.firstName = userEntity.firstName
    userModel.lastName = userEntity.lastName
    userModel.avatar = userEntity.avatar
    userModel.timezone = userEntity.timezone
    userModel.defaultLang = userEntity.defaultLang

    userModel.deletedAt = userEntity.deletedAt
      ? this.dateAdapter.toDatePersistence(userEntity.deletedAt)
      : null

    userModel.roleId = userEntity.roleId

    userModel.statusId = userEntity.status || StatusEnum.ACTIVE
    userModel.lastLoginAt = this.dateAdapter.toDatePersistence(userEntity.lastLoginAt)

    return userModel
  }
}
