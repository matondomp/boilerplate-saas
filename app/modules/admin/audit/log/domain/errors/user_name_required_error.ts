import { DomainError, Result } from '#core/domain/index'

export class UserNameRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: '',
      error: UserNameRequiredError.name,
    })
  }
}
