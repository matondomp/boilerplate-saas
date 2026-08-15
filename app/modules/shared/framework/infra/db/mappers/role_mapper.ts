/*
 * Copyright (c) 2023.
 * ITGest Angola
 */

import { Mapper, UniqueEntityID } from '#core/domain/index'
import { CoreRoleModel } from '#shared/framework/infra/db/models/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { RoleEntity } from '#shared/domain/entities/role_entity'

export class RoleMapper implements Mapper<RoleEntity, CoreRoleModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(roleModel: CoreRoleModel): RoleEntity {
    return RoleEntity.hydrate(
      new UniqueEntityID(roleModel.id),
      {
        name: roleModel.name,
        slug: roleModel.slug,
        description: roleModel.description,
        internal: Boolean(roleModel.isSystem),
        permissions: roleModel.permissions?.map((p) => new UniqueEntityID(p.id)),
        user: roleModel.createdByUser ? new UniqueEntityID(roleModel.createdByUser) : undefined,
      },
      {
        updatedAt: roleModel.updatedAt.toJSDate(),
        createdAt: roleModel.createdAt.toJSDate(),
        deletedAt: roleModel.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(roleEntity: RoleEntity): Promise<CoreRoleModel> {
    let roleModel: CoreRoleModel = new CoreRoleModel()
    roleModel.id = roleEntity.id.toString()

    const role = await CoreRoleModel.findBy('id', roleEntity.id.toString())

    if (role) {
      roleModel = role
    }

    roleModel.name = roleEntity.name
    roleModel.description = roleEntity.description
    roleModel.isSystem = roleEntity.isInternal
    roleModel.createdByUser = roleEntity.user?.toString()
    roleModel.deletedAt = this.dateAdapter.toDatePersistence(roleEntity.deletedAt)

    return roleModel
  }
}
