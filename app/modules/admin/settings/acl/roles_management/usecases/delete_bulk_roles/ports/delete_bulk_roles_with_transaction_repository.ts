import { UniqueEntityID } from '#core/domain/index'

export interface DeleteBulkRolesWithTransactionRespository {
  deleteWithTransaction(roleId: UniqueEntityID[], trx: any): Promise<void>
}
