import { DomainError, Result } from '#core/domain/index'

export class WrongCurrentPasswordError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'auth.current_password_mismatch',
      error: WrongCurrentPasswordError.name,
    })
  }
}
