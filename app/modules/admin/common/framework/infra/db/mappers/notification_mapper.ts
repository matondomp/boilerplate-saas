import { Mapper, UniqueEntityID } from '#core/domain/index'
import { CoreNotificationModel } from '#shared/framework/infra/db/models/core_notification_model'
import { NotificationEntity } from '#modules/admin/common/domain/index'

export class NotificationMapper implements Mapper<NotificationEntity, CoreNotificationModel> {
  toDomain(notificationModel: CoreNotificationModel): NotificationEntity {
    return NotificationEntity.hydrate(new UniqueEntityID(notificationModel.id), {
      name: notificationModel.notificationKey,
    })
  }
  toPersistence(
    _notificationEntity: NotificationEntity
  ): CoreNotificationModel | Promise<CoreNotificationModel> {
    throw new Error('(toPersistence) Method not implemented.')
  }
}
