import { UniqueEntityID } from '#core/domain/index'
import {
  Selected,
  SyncUserNotificationWithTransactionRepository,
} from '#modules/admin/common/usecases/index'
import { NotificationType } from '#shared/domain/types/index'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class SyncUserNotificationWithTransactionRepositoryImpl
  implements SyncUserNotificationWithTransactionRepository<TransactionClientContract>
{
  private readonly tableName = 'core_notifications_users'
  async sync(
    userId: UniqueEntityID,
    notifications: Selected[],
    trx: TransactionClientContract
  ): Promise<void> {
    await trx
      .insertQuery()
      .table(this.tableName)
      .insert(
        notifications.map((n) => ({
          id: new UniqueEntityID().toString(),
          user_id: userId.toString(),
          notification_id: n.notificationId.toString(),
          type: n.type,
        }))
      )
  }

  async removeAll(
    userId: UniqueEntityID,
    type: NotificationType,
    trx: TransactionClientContract
  ): Promise<void> {
    await trx
      .from(this.tableName)
      .where({
        user_id: userId.toString(),
        type: type,
      })
      .delete()
  }
}
