import { UniqueEntityID } from '#core/domain/index'
export interface PersistResetPasswordTokenRepository {
  persist(userId: UniqueEntityID, hash: string): Promise<void>
}
