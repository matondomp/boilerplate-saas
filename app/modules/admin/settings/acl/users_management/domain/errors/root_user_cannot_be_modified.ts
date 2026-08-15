import { DomainError, Result } from '#core/domain/index'

export class RootUserCannotBeModified extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.user.cannot_modify_root',
      error: RootUserCannotBeModified.name,
    })
  }
}
