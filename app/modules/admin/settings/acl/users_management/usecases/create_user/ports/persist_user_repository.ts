import { UserEntity } from '#shared/domain/entities/user_entity'

export interface PersistUserRepository {
  persist(user: UserEntity): Promise<string>
}
