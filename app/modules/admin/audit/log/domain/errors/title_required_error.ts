import { DomainError, Result } from '#core/domain/index'

export class TittleRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: '',
      error: TittleRequiredError.name,
    })
  }
}
