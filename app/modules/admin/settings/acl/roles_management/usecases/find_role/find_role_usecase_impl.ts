import {
  FindRoleUseCase,
  FindRoleUseCaseInput,
  FindRoleUseCaseOutput,
} from '#modules/admin/settings/acl/roles_management/domain/index'
import { RoleNotFoundError } from '#modules/admin/settings/acl/roles_management/domain/errors/index'
import { Either, left, right } from '#core/domain/index'
import { FindRoleBySlugRepository } from './ports/index.js'
import { DateAdapter } from '#shared/domain/ports/index'
import { FindUserIdRepository } from '#shared/usecases/ports/find_user_id_repository'

export class FindRoleUseCaseImpl implements FindRoleUseCase {
  constructor(
    private readonly findRoleBySlugRepository: FindRoleBySlugRepository,
    private readonly findUserByIdRepository: FindUserIdRepository,
    private readonly dateAdapter: DateAdapter
  ) {}

  async perform(
    input: FindRoleUseCaseInput
  ): Promise<Either<RoleNotFoundError, FindRoleUseCaseOutput>> {
    const roleEntity = await this.findRoleBySlugRepository.find(input.roleSlug)

    if (!roleEntity) {
      return left(new RoleNotFoundError())
    }

    const user = roleEntity.user && (await this.findUserByIdRepository.findUserId(roleEntity.user))

    return right({
      name: roleEntity.name,
      description: roleEntity.description,
      slug: roleEntity.slug,
      internal: roleEntity.isInternal,
      permissions: roleEntity.permissions.map((p) => p.toString()),
      updatedAtText: this.dateAdapter.toRelative(roleEntity.updatedAt),
      updatedAt: this.dateAdapter.format(roleEntity.updatedAt),
      user: user && {
        fullName: user.fullName,
        slug: user.slug,
      },
    })
  }
}
