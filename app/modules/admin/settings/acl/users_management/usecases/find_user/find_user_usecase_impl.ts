import { Either, left, right } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { FindUserUseCase, FindUserUseCaseInput, FindUserUseCaseOutput } from '../../domain/index.js'

import { FindUsernameWithRoleRepository } from './ports/index.js'
export class FindUserUseCaseImpl implements FindUserUseCase {
  constructor(
    private readonly findUsernameRepository: FindUsernameWithRoleRepository,
    private readonly dateAdapter: DateAdapter
  ) {}

  async perform(
    input: FindUserUseCaseInput
  ): Promise<Either<UserNotFoundError, FindUserUseCaseOutput>> {
    const root = await this.findUsernameRepository.findUsername(input.username)

    if (!root) {
      return left(new UserNotFoundError())
    }

    return right({
      avatar: root.user.avatar,
      slug: root.user.slug,
      fullName: root.user.fullName,
      updatedAt: this.dateAdapter.format(root.user.updatedAt),
      updatedAtText: this.dateAdapter.toRelative(root.user.updatedAt),
      lastLoginAt: this.dateAdapter.format(root.user.lastLoginAt),
      lastLoginText: this.dateAdapter.toRelative(root.user.lastLoginAt),
      email: root.user.email,
      status: root.user.status,
      role: {
        name: root.role.name,
        isRoot: root.user.isRoot,
        description: root.role.description,
        internal: root.role.isInternal,
      },
    })
  }
}
