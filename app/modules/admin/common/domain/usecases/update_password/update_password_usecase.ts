import { Either, UseCase } from '#core/domain/index'
import { NewPasswordMismatchError, UserNotFoundError } from '#modules/auth/domain/index'
import { SamePasswordError, WrongCurrentPasswordError } from '../../errors/index.js'
import { UpdatePasswordUseCaseInput } from './update_password_usecase_input.js'

export type UpdatePasswordUseCase = UseCase<
  UpdatePasswordUseCaseInput,
  Either<
    UserNotFoundError | WrongCurrentPasswordError | NewPasswordMismatchError | SamePasswordError,
    boolean
  >
>
