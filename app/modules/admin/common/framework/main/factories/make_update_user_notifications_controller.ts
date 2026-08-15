import { UpdateUserNotificationsController } from '#modules/admin/common/framework/main/controllers/update_user_notifications_controller'
import { UpdateUserNotificationsUseCaseImpl } from '#modules/admin/common/usecases/index'
import { SyncUserNotificationWithTransactionRepositoryImpl } from '#modules/admin/common/framework/infra/index'
import { EventDispatcher } from '#core/domain/index'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'

export const makeUpdateUserNotificationsController = (): UpdateUserNotificationsController => {
  return new UpdateUserNotificationsController(
    new UpdateUserNotificationsUseCaseImpl(
      new TransactionAdapterImpl(),
      new SyncUserNotificationWithTransactionRepositoryImpl(),
      EventDispatcher.getInstance()
    )
  )
}
