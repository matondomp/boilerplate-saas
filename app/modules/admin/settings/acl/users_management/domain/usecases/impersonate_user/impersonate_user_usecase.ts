import { Either, UniqueEntityID, UseCase } from '#core/domain/index'
import { InactiveUserCannotBeImpersonatedError } from '../../errors/index.js'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { UserCannotImpersonateRootUserError } from '../../errors/user_cannot_impersonate_root_user_error.js'

export namespace ImpersonateUserUseCase {
  export type Input = {
    username: UniqueEntityID
    role: UniqueEntityID
  }

  export type Output = Either<
    InactiveUserCannotBeImpersonatedError | UserNotFoundError | UserCannotImpersonateRootUserError,
    UniqueEntityID
  >

  export type Contract = UseCase<Input, Output>
}
