import { UserRoleAggregate } from '#shared/domain/aggregates/user_role_aggregate'
import { ListUsersUseCaseInput } from '#modules/admin/settings/acl/users_management/domain/index'
import { RetrieveWithPaginationContract } from '#shared/domain/ports/retrieve_with_pagination_contract'

export type ListUsersRepository = RetrieveWithPaginationContract<
  ListUsersUseCaseInput,
  UserRoleAggregate
>
