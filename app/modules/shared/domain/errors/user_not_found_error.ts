import { DomainError, Result } from '#core/domain/index'

export class UserNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'shared.user.not_found',
      error: UserNotFoundError.name,
    })
  }
}
