import { Entity, UniqueEntityID } from '#core/domain/index'

interface NotificationProps {
  name: string
  type?: string
}

export class NotificationEntity extends Entity<NotificationProps> {
  get name() {
    return this.props.name
  }

  get type(): string | undefined {
    return this.props.type
  }

  static hydrate(id: UniqueEntityID, props: NotificationProps) {
    return new NotificationEntity(props, id)
  }
}
