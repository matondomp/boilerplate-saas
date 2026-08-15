import { DomainError, Result } from '#core/domain/index'

export class UserCannotImpersonateRootUserError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.impersonate.user.cannot-impersonate-root',
      error: UserCannotImpersonateRootUserError.name,
    })
  }
}
