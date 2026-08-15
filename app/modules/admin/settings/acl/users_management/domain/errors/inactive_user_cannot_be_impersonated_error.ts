import { DomainError, Result } from '#core/domain/index'

export class InactiveUserCannotBeImpersonatedError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.impersonate.user.cannot_be_impersonated',
      error: InactiveUserCannotBeImpersonatedError.name,
    })
  }
}
