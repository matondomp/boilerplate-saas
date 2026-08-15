import { SyncUserNotificationWithTransactionRepository } from './ports/index.js'
import {
  InvalidNotificationTypeError,
  NotificationsUpdatedEvent,
  UpdateUserNotificationsUseCase,
  UpdateUserNotificationsUseCaseInput,
} from '#modules/admin/common/domain/index'
import { Either, IEventDispatcher, right, UniqueEntityID } from '#core/domain/index'
import { NotificationEnum } from '#shared/domain/types/index'
import { TransactionAdapter } from '#core/ports/index'

export class UpdateUserNotificationsUseCaseImpl implements UpdateUserNotificationsUseCase {
  constructor(
    private readonly transactionAdapter: TransactionAdapter,
    private readonly syncUserNotificationWithTransactionRepository: SyncUserNotificationWithTransactionRepository<any>,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(
    input: UpdateUserNotificationsUseCaseInput
  ): Promise<Either<InvalidNotificationTypeError, boolean>> {
    await this.transactionAdapter.useTransaction(async (trx) => {
      await this.syncUserNotificationWithTransactionRepository.removeAll(
        new UniqueEntityID(input.userId),
        NotificationEnum.email,
        trx
      )

      await this.syncUserNotificationWithTransactionRepository.removeAll(
        new UniqueEntityID(input.userId),
        NotificationEnum.platform,
        trx
      )

      await this.syncUserNotificationWithTransactionRepository.sync(
        new UniqueEntityID(input.userId),
        [
          ...input.platform.map((id) => ({
            notificationId: new UniqueEntityID(id),
            type: NotificationEnum.platform,
          })),
          ...input.email.map((id) => ({
            notificationId: new UniqueEntityID(id),
            type: NotificationEnum.email,
          })),
        ],
        trx
      )

      void this.eventDispatcher.publish(
        new NotificationsUpdatedEvent({
          action: !input.platform.length ? 'removeAll' : 'sync',
          type: NotificationEnum.platform,
        })
      )

      void this.eventDispatcher.publish(
        new NotificationsUpdatedEvent({
          action: !input.email.length ? 'removeAll' : 'sync',
          type: NotificationEnum.email,
        })
      )
    })

    return right(true)
  }
}
