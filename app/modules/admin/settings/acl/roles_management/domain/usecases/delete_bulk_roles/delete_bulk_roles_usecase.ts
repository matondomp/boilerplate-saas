import { Either, UseCase } from '#core/domain/index'
import { RoleHaveAssociatedUsersError, RoleNotFoundError } from '../../errors/index.js'
import { DeleteBulkRolesUseCaseInput } from './delete_bulk_roles_usecase_input.js'

export type DeleteBulkRolesUseCase = UseCase<
  DeleteBulkRolesUseCaseInput,
  Either<RoleNotFoundError | RoleHaveAssociatedUsersError, boolean>
>
