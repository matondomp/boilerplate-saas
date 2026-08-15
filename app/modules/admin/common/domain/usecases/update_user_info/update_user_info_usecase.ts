import { Either, UseCase } from '#core/domain/index'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { UpdateUserInfoUseCaseInput } from './update_user_info_usecase_input.js'

export type UpdateUserInfoUseCase = UseCase<
  UpdateUserInfoUseCaseInput,
  Either<UserNotFoundError, boolean>
>
