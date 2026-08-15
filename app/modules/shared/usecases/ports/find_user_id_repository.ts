import { UserEntity } from '#shared/domain/entities/user_entity'
import { UniqueEntityID } from '#core/domain/index'

export interface FindUserIdRepository {
  findUserId(id: UniqueEntityID): Promise<UserEntity | undefined>
}
