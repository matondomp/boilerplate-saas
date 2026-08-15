import { UniqueEntityID } from '#core/domain/index'
import { DeleteBulkRolesWithTransactionRespository } from '../../ports/index.js'

export const makeDeleteRolesWithTransactionRepositoryStub =
  (): DeleteBulkRolesWithTransactionRespository => {
    return new (class implements DeleteBulkRolesWithTransactionRespository {
      async deleteWithTransaction(_roleId: UniqueEntityID[], _trx: any): Promise<void> {}
    })()
  }
