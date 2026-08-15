import { Either, UseCase } from '#core/domain/index'
import { FindRoleUseCaseInput } from './find_role_usecase_input.js'
import { RoleNotFoundError } from '#modules/admin/settings/acl/roles_management/domain/errors/index'
import { FindRoleUseCaseOutput } from './find_role_usecase_output.js'

export type FindRoleUseCase = UseCase<
  FindRoleUseCaseInput,
  Either<RoleNotFoundError, FindRoleUseCaseOutput>
>
