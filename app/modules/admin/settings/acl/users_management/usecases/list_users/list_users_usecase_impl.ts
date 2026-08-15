import {
  ListUsersUseCase,
  ListUsersUseCaseInput,
  ListUsersUseCaseOutput,
  User,
} from '#modules/admin/settings/acl/users_management/domain/index'
import { ListUsersRepository } from './props/index.js'
import { DateAdapter } from '#shared/domain/ports/index'

export class ListUsersUseCaseImpl implements ListUsersUseCase {
  constructor(
    private readonly listUsersRepository: ListUsersRepository,
    private readonly dateAdapter: DateAdapter
  ) {}

  async perform(input: ListUsersUseCaseInput): Promise<ListUsersUseCaseOutput> {
    return this.listUsersRepository.findAll(input).then((pagination) => ({
      ...pagination,
      data: pagination.data?.map(
        (uR) =>
          ({
            updatedAt: this.dateAdapter.format(uR.user.updatedAt),
            updatedAtText: this.dateAdapter.toRelative(uR.user.updatedAt),
            fullName: uR.user.fullName,
            firstName: uR.user.firstName,
            lastName: uR.user.lastName,
            lastLoginAt: this.dateAdapter.format(uR.user.lastLoginAt),
            email: uR.user.email,
            lastLoginAtText: this.dateAdapter.toRelative(uR.user.lastLoginAt),
            slug: uR.user.slug,
            status: uR.user.status,
            avatar: uR.user.avatar,
            roleId: uR.role.id.toString(),
            roleText: uR.role.name,
            roleSlug: uR.role.slug,
          }) as User
      ),
    }))
  }
}
