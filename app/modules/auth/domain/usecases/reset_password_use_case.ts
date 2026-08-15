import { Either, UseCase } from '#core/domain/index'
import {
  TokenExpiredError,
  TokenNotFoundError,
  TokenRevokedError,
  PasswordMismatchError,
  UserNotFoundError,
} from '#modules/auth/domain/errors/index'

export namespace ResetPasswordUseCase {
  export type Input = {
    token: string
    password: string
    confirmPassword: string
  }
  export type Errors =
    | TokenExpiredError
    | TokenNotFoundError
    | TokenRevokedError
    | PasswordMismatchError
    | UserNotFoundError

  export type Output = Either<Errors, boolean>

  export type Contract = UseCase<Input, Output>
}
