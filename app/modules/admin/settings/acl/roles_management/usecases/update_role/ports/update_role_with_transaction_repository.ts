import { RoleEntity } from '../../../domain/entities/role_entity.js'

export interface UpdateRoleWithTransactionRepository<T> {
  updateWithTransaction(roleEntity: RoleEntity, trx: T): Promise<void>
}
