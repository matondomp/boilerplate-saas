import { EventType } from '#shared/domain/entities/notification_entity'

export interface RetrieveNewestNotificationsUseCaseOutput {
  unRead: number
  notifications: {
    message?: string
    title: string

    eventType: EventType

    routePath?: string
    icon?: string
    createdAtText: string
    createdAt: string
    hash: string
    event: string
  }[]
}
