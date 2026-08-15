import { DomainError, Result } from '#core/domain/index'

export class DashboardAlreadyExistError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'dashboard_management.create.name.already_exist',
      error: DashboardAlreadyExistError.name,
    })
  }
}
