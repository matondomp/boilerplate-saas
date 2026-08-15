import { Mapper, UniqueEntityID } from '#core/domain/index'
import { NotificationEntity } from '#shared/domain/entities/notification_entity'
import { CoreNotificationEventSchema } from '#shared/framework/infra/db/models/core_notification_event_model'

export class UserNotificationMapper
  implements Mapper<NotificationEntity, CoreNotificationEventSchema>
{
  toDomain(data: CoreNotificationEventSchema): NotificationEntity {
    return NotificationEntity.hydrate(
      new UniqueEntityID(data.hash),
      {
        icon: data.icon,
        userId: new UniqueEntityID(data.userId),
        readAt: data.readAt,
        subject: data.title,
        routePath: data.routePath,
        message: data.message,
        eventType: data.eventType,
        event: data.event,
      },
      {
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      }
    )
  }

  toPersistence(
    _data: NotificationEntity
  ): Promise<CoreNotificationEventSchema> | CoreNotificationEventSchema {
    throw new Error('Need to be implemented!')
  }
}
