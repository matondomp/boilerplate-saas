import { DomainError, Result } from '#core/domain/index'

export class TokenRevokedError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'auth.reset_password.token.revoked',
      error: TokenRevokedError.name,
    })
  }
}
