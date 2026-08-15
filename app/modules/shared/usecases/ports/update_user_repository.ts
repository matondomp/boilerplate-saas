import { UserEntity } from '#modules/auth/domain/index'

export interface UpdateUserRepository {
  update(user: UserEntity): Promise<void>
}
