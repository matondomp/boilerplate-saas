import { DomainError, Result } from '#core/domain/index'

export class RoleNotFoundError extends Result<DomainError> {
  constructor(roleName?: string) {
    super(false, {
      message: roleName ? 'admin.acl.role.not_found_with_role_name' : 'admin.acl.role.not_found',
      error: RoleNotFoundError.name,
      payload: roleName ? { roleName } : null,
    })
  }
}
