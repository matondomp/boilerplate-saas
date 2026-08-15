import { UniqueEntityID } from '#core/domain/index'
import { NotificationType } from '#shared/domain/types/index'

export interface Selected {
  notificationId: UniqueEntityID
  type: NotificationType
}

export interface SyncUserNotificationWithTransactionRepository<T> {
  sync(userId: UniqueEntityID, notifications: Selected[], trx: T): Promise<void>
  removeAll(userId: UniqueEntityID, type: NotificationType, trx: T): Promise<void>
}
