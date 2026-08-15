import { DomainError, Result } from '#core/domain/index'

export class RoleDescriptionRequiredError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.role.create_role.desc.required',
      error: RoleDescriptionRequiredError.name,
    })
  }
}
