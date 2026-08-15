import { Either, UseCase } from '#core/domain/index'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { FindUserUseCaseInput } from './find_user_usecase_input.js'
import { FindUserUseCaseOutput } from './find_user_usecase_output.js'

export type FindUserUseCase = UseCase<
  FindUserUseCaseInput,
  Either<UserNotFoundError, FindUserUseCaseOutput>
>
