import { ListUsersRepository } from '#modules/admin/settings/acl/users_management/usecases/list_users/props/index'
import { ListUsersUseCaseInput } from '#modules/admin/settings/acl/users_management/domain/index'
import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { getOperator, Operator, Pagination } from '#core/ports/index'
import { UserRoleMapper } from '#shared/framework/infra/db/mappers/index'
import { UserRoleAggregate } from '#shared/domain/aggregates/user_role_aggregate'
import db from '@adonisjs/lucid/services/db'

export class ListUsersRepositoryImpl implements ListUsersRepository {
  constructor(private readonly userRoleMapper: UserRoleMapper = new UserRoleMapper()) {}

  async findAll(input: ListUsersUseCaseInput): Promise<Pagination<UserRoleAggregate>> {
    const query = CoreUserModel.query()
      .whereNull('deleted_at')
      .orderBy(input.orderBy || 'updatedAt', input.orderByDirection || 'desc')
      .clone()

    if (input.filters) {
      const keys = Object.keys(input.filters).filter(
        (key) => input.filters && input.filters[key].value
      )

      for (const key of keys.filter((k) => k !== 'role' && k !== 'fullName')) {
        if (!input.filters[key].value) continue

        if (input.filters[key].operation === Operator.LIKE && input.filters[key].value.length > 0) {
          input.filters[key].value = `%${input.filters[key].value}%`
        }

        query.andWhere(
          key === 'status' ? 'status_id' : key,
          getOperator(input.filters[key].operation),
          input.filters[key].value
        )
      }

      if (input.filters.fullName.value) {
        query.andWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", [
          `%${input.filters.fullName.value}%`,
        ])
      }

      if (input.filters.role.value) {
        const role = await db.from('core_roles').where('slug', input.filters.role.value).first()

        if (!role) {
          return {
            pagination: {
              total: 0,
              perPage: 0,
              page: 0,
              sort: input.orderBy,
              direction: input.orderByDirection,
            },
            data: [],
          }
        }

        query.andWhere('role_id', role.id)
      }
    }

    const usersPaginated = await query.preload('role').paginate(input.page, input.perPage)

    return {
      pagination: {
        total: usersPaginated.total,
        perPage: usersPaginated.perPage,
        page: usersPaginated.currentPage,
        sort: input.orderBy,
        direction: input.orderByDirection,
      },
      data: usersPaginated.all().map((uR) => this.userRoleMapper.toDomain(uR)),
    }
  }
}
