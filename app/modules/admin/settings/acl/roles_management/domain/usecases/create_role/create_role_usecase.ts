import { Either, UseCase } from '#core/domain/index'

import { RoleAlreadyExistError } from '../../errors/index.js'
import { CreateRoleUseCaseInput } from './create_role_usecase_input.js'

export type CreateRoleUseCase = UseCase<
  CreateRoleUseCaseInput,
  Either<RoleAlreadyExistError, boolean>
>
