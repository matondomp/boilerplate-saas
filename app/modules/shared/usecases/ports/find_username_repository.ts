import { UserEntity } from '#shared/domain/entities/user_entity'

export interface FindUsernameRepository {
  findUsername(username: string): Promise<UserEntity | undefined>
}
