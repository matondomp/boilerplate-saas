import { UniqueEntityID } from '#core/domain/index'
import { UserEntity } from '#shared/domain/entities/user_entity'

export interface FindAssociatedUsersRepository {
  findAssociatedUsers(roleId: UniqueEntityID): Promise<UserEntity[]>
}
