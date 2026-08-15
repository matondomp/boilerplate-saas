import { Either, UseCase } from '#core/domain/index'
import { EmailError } from '#shared/domain/errors/index'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { UserAlreadyExistError } from '../../errors/index.js'
import { UpdateUserUseCaseInput } from './update_user_usecase_input.js'

export type UpdateUserErrors =
  | UserAlreadyExistError
  | UserNotFoundError
  | EmailError.EmailInvalidError
  | EmailError.EmailRequiredError

export type UpdateUserUseCase = UseCase<UpdateUserUseCaseInput, Either<UpdateUserErrors, boolean>>
