import { DomainError, Result } from '#core/domain/index'

export class DashboardItemNotFoundError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'dashboard_management.items.not_found',
      error: DashboardItemNotFoundError.name,
    })
  }
}
