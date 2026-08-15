import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import { TransactionAdapter } from '#core/ports/index'
import { DeleteBulkRolesUseCase, DeleteBulkRolesUseCaseInput } from '../../domain/index.js'
import {
  NonRootCannotModifyError,
  RoleHaveAssociatedUsersError,
  RoleNotFoundError,
} from '../../domain/errors/index.js'
import { BulkRolesDeletedEvent } from '../../domain/events/bulk_roles_deleted_event.js'
import {
  FindAssociatedUsersRepository,
  DeleteBulkRolesWithTransactionRespository,
  FindRoleBySlugRepository,
} from './ports/index.js'

export class DeleteBulkRolesUseCaseImpl implements DeleteBulkRolesUseCase {
  constructor(
    private readonly transactionAdapter: TransactionAdapter,
    private readonly findAssociatedUsersRepository: FindAssociatedUsersRepository,
    private readonly findRoleBySlugRepository: FindRoleBySlugRepository,
    private readonly deleteBulkRolesWithTransaction: DeleteBulkRolesWithTransactionRespository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  private async applyValidations(
    roleSlugs: string[],
    isRoot: boolean
  ): Promise<Either<RoleNotFoundError | RoleHaveAssociatedUsersError, UniqueEntityID[]>> {
    const roleIds: UniqueEntityID[] = []

    for (const role of roleSlugs) {
      const roleEntity = await this.findRoleBySlugRepository.find(role)
      if (!roleEntity) {
        return left(new RoleNotFoundError(role))
      }

      if (roleEntity.isInternal && !isRoot) {
        return left(new NonRootCannotModifyError())
      }

      const usersArray = await this.findAssociatedUsersRepository.findAssociatedUsers(roleEntity.id)

      if (usersArray.length) {
        return left(new RoleHaveAssociatedUsersError(roleEntity.name))
      }

      roleIds.push(roleEntity.id)
    }

    return right(roleIds)
  }

  async perform(
    input: DeleteBulkRolesUseCaseInput
  ): Promise<Either<RoleNotFoundError | RoleHaveAssociatedUsersError, boolean>> {
    const roleIdsOrError = await this.applyValidations(input.roles, input.isRoot)

    if (roleIdsOrError.isLeft()) {
      return left(roleIdsOrError.value)
    }

    await this.transactionAdapter.useTransaction(async (trx) => {
      await this.deleteBulkRolesWithTransaction.deleteWithTransaction(roleIdsOrError.value, trx)
    })

    await this.eventDispatcher.publish(
      new BulkRolesDeletedEvent({
        roles: roleIdsOrError.value,
      })
    )

    return right(true)
  }
}
