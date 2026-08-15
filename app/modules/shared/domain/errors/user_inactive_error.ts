import { DomainError, Result } from '#core/domain/index'

export class UserInactiveError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.shared.user.inactive',
      error: UserInactiveError.name,
    })
  }
}
