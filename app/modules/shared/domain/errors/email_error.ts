import { DomainError, Result } from '#core/domain/index'

export namespace EmailError {
  export class EmailRequiredError extends Result<DomainError> {
    constructor() {
      super(false, {
        message: 'user.email.required',
        error: EmailRequiredError.name,
      })
    }
  }

  export class EmailInvalidError extends Result<DomainError> {
    constructor() {
      super(false, {
        message: 'user.email.invalid',
        error: EmailInvalidError.name,
      })
    }
  }
}
