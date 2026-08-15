import { Either, UseCase } from '#core/domain/index'
import { RedefinePasswordUseCaseInput } from './redefine_password_usecase_input.js'
import { UserInactiveError, UserNotFoundError } from '#shared/domain/errors/index'

export type RedefinePasswordUseCase = UseCase<
  RedefinePasswordUseCaseInput,
  Either<UserNotFoundError | UserInactiveError, string>
>
