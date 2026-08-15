import { DomainError, Result } from '#core/domain/index'

export class PermissionAreMissingError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.role.create_role.missing_permissions',
      error: PermissionAreMissingError.name,
    })
  }
}
