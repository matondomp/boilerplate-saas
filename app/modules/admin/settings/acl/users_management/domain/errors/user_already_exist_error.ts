import { DomainError, Result } from '#core/domain/index'

export class UserAlreadyExistError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'admin.acl.user.already_exist',
      error: UserAlreadyExistError.name,
    })
  }
}
