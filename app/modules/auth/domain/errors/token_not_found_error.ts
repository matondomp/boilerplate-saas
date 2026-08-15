import { DomainError, Result } from '#core/domain/index'

export class TokenNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'auth.reset_password.token.not_found',
      error: TokenNotFoundError.name,
    })
  }
}
