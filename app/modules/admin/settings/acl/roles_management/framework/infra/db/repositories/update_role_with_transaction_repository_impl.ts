import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'
import { UniqueEntityID } from '#core/domain/index'
import { UpdateRoleWithTransactionRepository } from '../../../../usecases/index.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class UpdateRoleWithTransactionRepositoryImpl
  implements UpdateRoleWithTransactionRepository<any>
{
  constructor(private readonly roleMapper: RoleMapper) {}

  async updateWithTransaction(
    roleEntity: RoleEntity,
    trx: TransactionClientContract
  ): Promise<void> {
    const roleModel = await this.roleMapper.toPersistence(roleEntity)

    roleModel.useTransaction(trx)
    await roleModel.save()

    // remove

    await trx.from('core_role_permissions').andWhere('role_id', roleEntity.id.toString()).delete()

    // insert
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
