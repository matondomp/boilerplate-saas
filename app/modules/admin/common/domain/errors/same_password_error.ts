import { DomainError, Result } from '#core/domain/index'

export class SamePasswordError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'auth.same_password_error',
      error: SamePasswordError.name,
    })
  }
}
