import { UseCase, Either } from '#core/domain/index'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { UnblockUserUseCaseInput } from './unblock_user_usecase_input.js'

export type UnblockUserUseCase = UseCase<
  UnblockUserUseCaseInput,
  Either<UserNotFoundError, boolean>
>
