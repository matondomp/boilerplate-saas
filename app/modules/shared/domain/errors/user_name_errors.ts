import { DomainError, Result } from '#core/domain/index'

export namespace UserNameErrors {
  export class UserFirstNameRequiredError extends Result<DomainError> {
    constructor() {
      super(false, {
        message: 'admin.acl.user.first_name.required',
        error: UserFirstNameRequiredError.name,
      })
    }
  }

  export class UserLastNameRequiredError extends Result<DomainError> {
    constructor() {
      super(false, {
        message: 'admin.acl.user.last_name.required',
        error: UserLastNameRequiredError.name,
      })
    }
  }
}
