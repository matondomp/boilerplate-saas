import { Entity, Options, UniqueEntityID } from '#core/domain/index'

export type EventType = 'success' | 'error' | 'warning' | 'info'

interface NotificationProps {
  readAt: Date | null
  userId: UniqueEntityID
  subject: string
  message: string | null

  event: string

  routePath?: string
  eventType: EventType
  icon?: string
}

export class NotificationEntity extends Entity<NotificationProps> {
  get readAt(): Date | null {
    return this.props.readAt
  }
  get icon(): string | undefined {
    return this.props.icon
  }
  get userId(): UniqueEntityID {
    return this.props.userId
  }
  get subject(): string {
    return this.props.subject
  }
  get message(): string {
    return this.props.message ?? ''
  }

  get event(): string {
    return this.props.event
  }

  get routePath(): string | undefined {
    return this.props.routePath
  }
  get eventType(): EventType {
    return this.props.eventType
  }

  static hydrate(id: UniqueEntityID, props: NotificationProps, options?: Options) {
    return new NotificationEntity(props, id, options)
  }
}
