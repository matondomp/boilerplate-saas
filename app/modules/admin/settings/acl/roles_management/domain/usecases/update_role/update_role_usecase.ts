import { Either, UseCase } from '#core/domain/index'
import { NonRootCannotModifyError, RoleNotFoundError } from '../../errors/index.js'
import { UpdateRoleUseCaseInput } from './update_role_usecase_input.js'

export type UpdateRoleUseCase = UseCase<
  UpdateRoleUseCaseInput,
  Either<RoleNotFoundError | NonRootCannotModifyError, boolean>
>
