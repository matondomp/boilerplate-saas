import { Either, UseCase } from '#core/domain/index'
import { DeleteRoleUseCaseInput } from './delete_role_usecase_input.js'
import {
  NonRootCannotModifyError,
  RoleHaveAssociatedUsersError,
  RoleNotFoundError,
} from '#modules/admin/settings/acl/roles_management/domain/errors/index'

export type DeleteRoleUseCase = UseCase<
  DeleteRoleUseCaseInput,
  Either<RoleNotFoundError | RoleHaveAssociatedUsersError | NonRootCannotModifyError, boolean>
>
