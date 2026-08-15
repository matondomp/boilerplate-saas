import { CoreRoleModel } from '#shared/framework/infra/db/models/index'
import { getOperator, Operator, Pagination } from '#core/ports/index'
import { ListRolesRepository } from '#modules/admin/settings/acl/roles_management/usecases/list_roles/props/index'
import { ListRolesUseCaseInput } from '#modules/admin/settings/acl/roles_management/domain/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import { RoleMapper } from '#shared/framework/infra/db/mappers/index'

export class ListRolesRepositoryImpl implements ListRolesRepository {
  constructor(private readonly roleMapper: RoleMapper = new RoleMapper()) {}

  async findAll(input: ListRolesUseCaseInput): Promise<Pagination<RoleEntity>> {
    let query = CoreRoleModel.query()
      .whereNull('deleted_at')
      .andWhere((q) => {
        if (!input.isRoot) {
          q.whereNot('slug', 'root')
        }
      })
      .clone()

    if (input.orderByDirection && input.orderBy) {
      query = query.orderBy(input.orderBy || 'updatedAt', input.orderByDirection || 'desc')
    }

    if (input.filters) {
      const keys = Object.keys(input.filters).filter(
        (key) => input.filters && input.filters[key].value
      )

      for (const key of keys) {
        let filter = input.filters[key]
        if (filter.operation === Operator.LIKE) {
          filter.value = `%${filter.value}%`
        }

        query = query.andWhere(key, getOperator(filter.operation), filter.value)
      }
    }

    const rolesPaginated = await query.paginate(input.page, input.perPage)

    return {
      pagination: {
        total: rolesPaginated.total,
        perPage: rolesPaginated.perPage,
        page: rolesPaginated.currentPage,
        sort: input.orderBy,
        direction: input.orderByDirection,
      },
      data: rolesPaginated.all().map(this.roleMapper.toDomain),
    }
  }
}
