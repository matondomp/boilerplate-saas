import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'

export interface CreateRoleWithTransactionRepository<T> {
  persistWithTransaction(roleEntity: RoleEntity, trx: T): Promise<void>
}
