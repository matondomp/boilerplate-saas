import { DomainEvent } from '#core/domain/index'
import { NotificationType } from '#shared/domain/types/index'

interface NotificationUpdatedProps {
  action: 'removeAll' | 'sync'
  type: NotificationType
}

export class NotificationsUpdatedEvent extends DomainEvent<NotificationUpdatedProps> {}
