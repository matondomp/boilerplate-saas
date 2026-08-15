import { ListRolesRepository } from './props/index.js'
import { DateAdapter } from '#shared/domain/ports/index'
import {
  ListRolesUseCaseInput,
  ListRolesUseCaseOutput,
  Role,
} from '#modules/admin/settings/acl/roles_management/domain/index'
import { ListRolesUseCase } from '#modules/admin/settings/acl/roles_management/domain/usecases/list_roles/list_roles_usecase'

export class ListRolesUseCaseImpl implements ListRolesUseCase {
  constructor(
    private readonly listRolesRepository: ListRolesRepository,
    private readonly dateAdapter: DateAdapter
  ) {}

  async perform(input: ListRolesUseCaseInput): Promise<ListRolesUseCaseOutput> {
    return this.listRolesRepository.findAll(input).then((pagination) => ({
      ...pagination,
      data: pagination.data?.map(
        (r) =>
          ({
            updatedAt: this.dateAdapter.format(r.updatedAt),
            updatedAtText: this.dateAdapter.toRelative(r.updatedAt),
            description: r.description,
            name: r.name,
            slug: r.slug,
            isInternal: r.isInternal,
          }) as Role
      ),
    }))
  }
}
