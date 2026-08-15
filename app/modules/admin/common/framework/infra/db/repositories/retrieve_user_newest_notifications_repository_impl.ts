import { Pagination } from '#core/ports/index'
import { UniqueEntityID } from '#core/domain/index'
import { NotificationEntity } from '#shared/domain/entities/notification_entity'
import {
  RetrieveUserNotificationsRepository,
  Options,
  NotificationsWithCount,
} from '#modules/admin/common/usecases/index'
import { UserNotificationMapper } from '#shared/framework/infra/db/mappers/user_notification_mapper'
import { CoreNotificationEventModel } from '#shared/framework/infra/db/models/core_notification_event_model'

export class RetrieveUserNewestNotificationsRepositoryImpl
  implements RetrieveUserNotificationsRepository
{
  private readonly collection = CoreNotificationEventModel

  constructor(
    private readonly userNotificationMapper: UserNotificationMapper = new UserNotificationMapper()
  ) {}

  private compute(options: { userId: UniqueEntityID; hideOpenedNotifications: boolean }): any {
    const mountWhere = {
      userId: options.userId.toString(),
      readAt: null,
    } as any

    if (!options.hideOpenedNotifications) {
      mountWhere.readAt = {
        $ne: null,
      }
    }

    return mountWhere
  }

  async findAll(
    userId: UniqueEntityID,
    options: Options
  ): Promise<NotificationsWithCount | Pagination<NotificationEntity>> {
    const mountWhere = this.compute({
      userId,
      hideOpenedNotifications: options.hideOpenedNotifications,
    })

    const notifications = await this.collection
      .find(mountWhere)
      .sort('createdAt', options.orderDirection)
      .skip(options.perPage * (options.page - 1))
      .limit(options.perPage)
      .toArray()

    const totalRecords = await this.collection.countDocuments(mountWhere)

    if (options.withPagination) {
      return {
        pagination: {
          total: totalRecords,
          perPage: options.perPage,
          page: options.page,
        },
        data: notifications.map(this.userNotificationMapper.toDomain),
      }
    }

    return {
      unRedead: totalRecords,
      notifications: notifications.map(this.userNotificationMapper.toDomain),
    }
  }
}
