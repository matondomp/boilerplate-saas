import { ListAllRolesRepository } from './props/index.js'
import {
  ListRolesDropdownUseCase,
  ListRolesDropdownUseCaseInput,
  ListRolesDropdownUseCaseOutput,
  RoleOptions,
} from '#modules/admin/settings/acl/roles_management/domain/usecases/list_roles_dropdown/index'

export class ListRolesDropdownUseCaseImpl implements ListRolesDropdownUseCase {
  constructor(private readonly listAllRolesRepository: ListAllRolesRepository) {}

  async perform(input: ListRolesDropdownUseCaseInput): Promise<ListRolesDropdownUseCaseOutput> {
    return this.listAllRolesRepository.findAll(input).then((data) =>
      data
        .filter((r) => r.slug !== 'root')
        .map(
          (r) =>
            ({
              name: r.name,
              id: r.id.toString(),
              slug: r.slug,
            }) as RoleOptions
        )
    )
  }
}
