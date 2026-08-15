import { DomainError, Result } from '#core/domain/index'

export class DashboardNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'dashboard_management.not_found',
      error: DashboardNotFoundError.name,
    })
  }
}
