import { Either, UseCase } from '#core/domain/index'
import { UserNotFoundError, PasswordMismatchError } from '../errors/index.js'

export namespace AuthenticateUserUseCase {
  export type Input = {
    username: string
    password: string
  }

  export type Output = Either<
    Errors,
    {
      userId: string
    }
  >

  export type Errors = UserNotFoundError | PasswordMismatchError

  export type Contract = UseCase<Input, Output>
}
