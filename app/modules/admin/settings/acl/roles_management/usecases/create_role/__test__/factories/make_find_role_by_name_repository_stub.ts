import { FindRoleByNameRepository } from '#modules/admin/settings/acl/roles_management/usecases/create_role/ports/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { UniqueEntityID } from '#core/domain/index'

export const makeFindRoleByNameRepositoryStub = (): FindRoleByNameRepository => {
  return new (class implements FindRoleByNameRepository {
    async findByName(name: string): Promise<RoleEntity> {
      return RoleEntity.hydrate(new UniqueEntityID('valid_role_id'), {
        name,
        description: 'valid_desc',
        internal: false,
        permissions: [new UniqueEntityID('valid_permission_id')],
      })
    }
  })()
}
