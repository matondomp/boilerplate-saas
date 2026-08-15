import { DomainError, Result } from '#core/domain/index'

export class RoleAlreadyExistError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.role.create_role.already_exist',
      error: RoleAlreadyExistError.name,
    })
  }
}
