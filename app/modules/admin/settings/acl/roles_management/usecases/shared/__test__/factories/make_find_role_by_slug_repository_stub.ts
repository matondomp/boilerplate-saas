import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { UniqueEntityID } from '#core/domain/index'
import { FindRoleBySlugRepository } from '../../ports/find_role_by_slug_repository.js'

export const makeFindRoleBySlugRepositoryStub = (): FindRoleBySlugRepository => {
  return new (class implements FindRoleBySlugRepository {
    async find(_slug: string): Promise<RoleEntity> {
      return RoleEntity.hydrate(new UniqueEntityID('valid_role_id'), {
        name: 'valid_name',
        description: 'valid_desc',
        internal: false,
        permissions: [new UniqueEntityID('valid_permission_id')],
      })
    }
  })()
}
