import { UserRoleAggregate } from '#shared/domain/aggregates/user_role_aggregate'

export interface FindUsernameWithRoleRepository {
  findUsername(username: string): Promise<UserRoleAggregate | undefined>
}
