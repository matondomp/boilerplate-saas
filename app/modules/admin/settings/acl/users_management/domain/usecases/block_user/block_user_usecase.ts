import { Either, UseCase } from '#core/domain/index'
import { UserNotFoundError } from '#shared/domain/errors/index'
import { RootUserCannotBeModified } from '../../errors/index.js'
import { BlockUserUseCaseInput } from './block_user_usecase_input.js'

export type BlockUserUseCase = UseCase<
  BlockUserUseCaseInput,
  Either<UserNotFoundError | RootUserCannotBeModified, boolean>
>
