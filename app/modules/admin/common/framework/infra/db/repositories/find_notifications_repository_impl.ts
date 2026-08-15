import { UniqueEntityID } from '#core/domain/index'
import { CoreNotificationModel } from '#shared/framework/infra/db/models/core_notification_model'
import { NotificationEntity } from '#modules/admin/common/domain/index'
import { FindNotificationsRepository } from '#modules/admin/common/usecases/index'
import { NotificationMapper } from '../mappers/index.js'
import Database from '@adonisjs/lucid/services/db'

export class FindNotificationsRepositoryImpl implements FindNotificationsRepository {
  constructor(private readonly notificationMapper: NotificationMapper) {}

  async findActiveNotifications(userId: string): Promise<NotificationEntity[]> {
    const activeNotifications = await Database.query()
      .from('core_notifications as cn')
      .select('cn.id', 'cn.notification_key as name', 'cnu.type')
      .innerJoin('core_notifications_users as cnu', 'cnu.notification_id', 'cn.id')
      .whereNull('cn.deleted_at')
      .andWhere('cnu.user_id', userId)
      .exec()

    return activeNotifications.map((aN) => {
      return NotificationEntity.hydrate(new UniqueEntityID(aN.id), {
        type: aN.type,
        name: aN.name,
      })
    })
  }

  async findAll(): Promise<NotificationEntity[]> {
    const notifications = await CoreNotificationModel.query().whereNull('deleted_at').exec()

    return notifications.map(this.notificationMapper.toDomain)
  }
}
