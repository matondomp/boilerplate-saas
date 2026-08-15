import { UniqueEntityID } from '#core/domain/index'
import { NotificationEntity } from '#shared/domain/entities/notification_entity'
import { Pagination } from '#core/ports/index'

export interface Options {
  hideOpenedNotifications: boolean
  orderDirection: 'asc' | 'desc'
  page: number
  perPage: number
  withPagination: boolean
}

export type NotificationsWithCount = {
  unRedead: number
  notifications: NotificationEntity[]
}

export interface RetrieveUserNotificationsRepository {
  findAll(
    userId: UniqueEntityID,
    options: Options
  ): Promise<NotificationsWithCount | Pagination<NotificationEntity>>
}
