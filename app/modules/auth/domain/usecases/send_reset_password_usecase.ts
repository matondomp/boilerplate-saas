import { Either, UseCase } from '#core/domain/index'
import { UserNotFoundError } from '../errors/index.js'
export namespace SendResetPasswordUseCase {
  export type Input = {
    username: string
  }

  export type Errors = UserNotFoundError

  export type Output = Either<Errors, boolean>

  export type Contract = UseCase<Input, Output>
}
