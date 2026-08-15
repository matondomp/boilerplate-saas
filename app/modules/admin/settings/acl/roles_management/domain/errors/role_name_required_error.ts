import { DomainError, Result } from '#core/domain/index'

export class RoleNameRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.role.create_role.name.required',
      error: RoleNameRequiredError.name,
    })
  }
}
