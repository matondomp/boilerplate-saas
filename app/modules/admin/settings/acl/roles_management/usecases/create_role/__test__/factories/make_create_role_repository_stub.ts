import { CreateRoleWithTransactionRepository } from '#modules/admin/settings/acl/roles_management/usecases/create_role/ports/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
export const makeCreateRoleRepositoryStub = (): CreateRoleWithTransactionRepository<any> => {
  return new (class implements CreateRoleWithTransactionRepository<any> {
    async persistWithTransaction(_roleEntity: RoleEntity): Promise<void> {
      //
    }
  })()
}
