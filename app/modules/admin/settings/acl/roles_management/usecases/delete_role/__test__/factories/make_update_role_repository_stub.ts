import { RoleEntity } from '../../../../domain/entities/role_entity.js'
import { UpdateRoleRepository } from '../../ports/index.js'

export const makeUpdateRoleRepositoryStub = (): UpdateRoleRepository => {
  return new (class implements UpdateRoleRepository {
    async update(_roleEntity: RoleEntity): Promise<void> {
      // do nothing
    }
  })()
}
