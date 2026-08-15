import { DomainError, Result } from '#core/domain/index'

export class CannotDeleteDefaultDashboardError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'dashboard_management.default.cannot_delete',
      error: CannotDeleteDefaultDashboardError.name,
    })
  }
}
