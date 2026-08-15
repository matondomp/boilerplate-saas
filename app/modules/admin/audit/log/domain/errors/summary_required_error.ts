import { DomainError, Result } from '#core/domain/index'

export class SummaryRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: '',
      error: SummaryRequiredError.name,
    })
  }
}
