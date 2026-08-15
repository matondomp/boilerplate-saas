import { Either, UseCase } from '#core/domain/index'
import { CreateUserUseCaseInput } from './create_user_usecase_input.js'
import { UserAlreadyExistError } from '#modules/admin/settings/acl/users_management/domain/errors/index'

export type CreateUserUseCase = UseCase<
  CreateUserUseCaseInput,
  Either<UserAlreadyExistError, string>
>
