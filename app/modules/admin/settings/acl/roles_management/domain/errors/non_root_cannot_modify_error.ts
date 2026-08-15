import { DomainError, Result } from '#core/domain/index'

export class NonRootCannotModifyError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.role.no_previlegies',
      error: NonRootCannotModifyError.name,
    })
  }
}
