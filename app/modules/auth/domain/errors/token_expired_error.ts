import { DomainError, Result } from '#core/domain/index'

export class TokenExpiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'auth.reset_password.token.expired',
      error: TokenExpiredError.name,
    })
  }
}
