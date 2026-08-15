import {
  CreateRoleUseCase,
  CreateRoleUseCaseInput,
} from '#modules/admin/settings/acl/roles_management/domain/index'
import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import { RoleAlreadyExistError } from '#modules/admin/settings/acl/roles_management/domain/errors/index'
import { RoleEntity } from '#modules/admin/settings/acl/roles_management/domain/entities/role_entity'
import {
  CreateRoleWithTransactionRepository,
  FindRoleByNameRepository,
} from '#modules/admin/settings/acl/roles_management/usecases/create_role/ports/index'
import { RoleCreatedEvent } from '#modules/admin/settings/acl/roles_management/domain/events/index'
import { TransactionAdapter } from '#core/ports/index'

export class CreateRoleUseCaseImpl implements CreateRoleUseCase {
  constructor(
    private readonly findRoleByNameRepository: FindRoleByNameRepository,
    private readonly createRoleWithTransactionRepository: CreateRoleWithTransactionRepository<any>,
    private readonly transactionAdapter: TransactionAdapter,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: CreateRoleUseCaseInput): Promise<Either<RoleAlreadyExistError, boolean>> {
    const roleEntityOrError = RoleEntity.create({
      name: input.name,
      description: input.description,
      permissions: input.permissions.map((p) => new UniqueEntityID(p)),
      user: new UniqueEntityID(input.userId),
    })

    if (roleEntityOrError.isLeft()) {
      return left(roleEntityOrError.value)
    }

    const roleAlreadyExists = await this.findRoleByNameRepository.findByName(
      roleEntityOrError.value.name
    )

    if (roleAlreadyExists) {
      return left(new RoleAlreadyExistError())
    }

    await this.transactionAdapter.useTransaction((trx) =>
      this.createRoleWithTransactionRepository.persistWithTransaction(roleEntityOrError.value, trx)
    )

    await this.eventDispatcher.publish(
      new RoleCreatedEvent({
        roleId: roleEntityOrError.value.id,
      })
    )

    return right(true)
  }
}
