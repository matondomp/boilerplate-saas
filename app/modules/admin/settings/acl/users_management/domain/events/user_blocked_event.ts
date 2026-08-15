import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface UserBlockedProps {
  userId: UniqueEntityID
}

export class UserBlockedEvent extends DomainEvent<UserBlockedProps> {}
