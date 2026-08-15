import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import {
  NonRootCannotModifyError,
  RoleHaveAssociatedUsersError,
  RoleNotFoundError,
} from '#modules/admin/settings/acl/roles_management/domain/errors/index'
import {
  DeleteRoleUseCase,
  DeleteRoleUseCaseInput,
} from '#modules/admin/settings/acl/roles_management/domain/index'
import { RoleDeleted } from '#modules/admin/settings/acl/roles_management/domain/events/role_deleted_event'
import {
  FindAssociatedUsersRepository,
  FindRoleBySlugRepository,
  UpdateRoleRepository,
} from '#modules/admin/settings/acl/roles_management/usecases/delete_role/ports/index'

export class DeleteRoleUseCaseImpl implements DeleteRoleUseCase {
  constructor(
    private readonly findRoleBySlugRepository: FindRoleBySlugRepository,
    private readonly findAssociatedUsersRepository: FindAssociatedUsersRepository,
    private readonly updateRoleRepository: UpdateRoleRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(
    input: DeleteRoleUseCaseInput
  ): Promise<
    Either<RoleNotFoundError | RoleHaveAssociatedUsersError | NonRootCannotModifyError, boolean>
  > {
    const roleEntity = await this.findRoleBySlugRepository.find(input.roleId)

    if (!roleEntity) {
      return left(new RoleNotFoundError())
    }

    if (roleEntity.isInternal && !input.isRoot) {
      return left(new NonRootCannotModifyError())
    }

    const associatedUsers = await this.findAssociatedUsersRepository.findAssociatedUsers(
      roleEntity.id
    )

    if (associatedUsers.length) {
      return left(new RoleHaveAssociatedUsersError())
    }

    roleEntity.delete()

    await this.updateRoleRepository.update(roleEntity)

    this.eventDispatcher.publish(
      new RoleDeleted({
        roleId: new UniqueEntityID(input.roleId),
      })
    )

    return right(true)
  }
}
