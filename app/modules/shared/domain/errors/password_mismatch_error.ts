import { DomainError, Result } from '#core/domain/index'

export class PasswordMismatchError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'auth.password_mismatch',
      error: PasswordMismatchError.name,
    })
  }
}

export class NewPasswordMismatchError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'auth.new_password_mismatch',
      error: NewPasswordMismatchError.name,
    })
  }
}
