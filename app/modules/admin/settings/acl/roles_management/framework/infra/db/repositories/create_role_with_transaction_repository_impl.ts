import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import { CreateRoleWithTransactionRepository } from '#modules/admin/settings/acl/roles_management/usecases/create_role/ports/index'
import { UniqueEntityID } from '#core/domain/index'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class CreateRoleWithTransactionRepositoryImpl
  implements CreateRoleWithTransactionRepository<any>
{
  constructor(private readonly roleMapper: RoleMapper) {}
  async persistWithTransaction(
    roleEntity: RoleEntity,
    trx: TransactionClientContract
  ): Promise<void> {
    const roleModel = await this.roleMapper.toPersistence(roleEntity)

    roleModel.useTransaction(trx)
    await roleModel.save()

    await trx.table('core_role_permissions').insert(
      roleEntity.permissions
        .map((p) => p.toString())
        .map((p) => ({
          id: new UniqueEntityID().toString(),
          permission_id: p,
          role_id: roleEntity.id.toString(),
        }))
    )
  }
}
