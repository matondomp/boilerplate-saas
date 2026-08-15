import { UniqueEntityID } from '#core/domain/index'
import { CoreRoleModel } from '#shared/framework/infra/db/models/index'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DeleteBulkRolesWithTransactionRespository } from './../../../../usecases/index.js'

export class DeleteBulkRolesWithTransactionRespositoryImpl
  implements DeleteBulkRolesWithTransactionRespository
{
  async deleteWithTransaction(
    roleIds: UniqueEntityID[],
    trx: TransactionClientContract
  ): Promise<void> {
    await CoreRoleModel.query({ client: trx })
      .whereIn(
        'id',
        roleIds.map((r) => r.toString())
      )
      .update({
        deleted_at: new Date(),
      })
  }
}
