import { NotificationEntity } from '../../../domain/index.js'

export interface FindNotificationsRepository {
  findAll(): Promise<NotificationEntity[]>
  findActiveNotifications(userId: string): Promise<NotificationEntity[]>
}
