import { IEventDispatcher, left, right } from '#core/domain/index'
import { ImpersonateUserUseCase } from '../../domain/index.js'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { InactiveUserCannotBeImpersonatedError } from '../../domain/errors/index.js'
import { UserCannotImpersonateRootUserError } from './../../domain/errors/user_cannot_impersonate_root_user_error.js'
import { FindUsernameWithRoleRepository } from '../find_user/index.js'
import { UserImpersonatedEvent } from '../../domain/events/index.js'

export class ImpersonateUserUseCaseImpl implements ImpersonateUserUseCase.Contract {
  constructor(
    private readonly findUsernameRepository: FindUsernameWithRoleRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: ImpersonateUserUseCase.Input): Promise<ImpersonateUserUseCase.Output> {
    const userRole = await this.findUsernameRepository.findUsername(input.username.toString())

    if (!userRole) {
      return left(new UserNotFoundError())
    }

    if (userRole.user.isInactive) {
      return left(new InactiveUserCannotBeImpersonatedError())
    }

    if (userRole.role.slug === 'root' && input.role.toString() !== 'root') {
      return left(new UserCannotImpersonateRootUserError())
    }

    void this.eventDispatcher.publish(
      new UserImpersonatedEvent({
        userId: userRole.user.id,
      })
    )

    return right(userRole.user.id)
  }
}
