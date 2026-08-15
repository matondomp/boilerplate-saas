import { Either, UseCase } from '#core/domain/index'
import { UserNotFoundError } from '#modules/auth/domain/index'
import { RootUserCannotBeModified } from '../../errors/index.js'
import { DeleteUserUseCaseInput } from './delete_user_usecase_input.js'

export type DeleteUserUseCase = UseCase<
  DeleteUserUseCaseInput,
  Either<UserNotFoundError | RootUserCannotBeModified, boolean>
>
