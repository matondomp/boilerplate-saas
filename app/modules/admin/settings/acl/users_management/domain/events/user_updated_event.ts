import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface UserEvent {
  fullName: string
  email: string
  roleId: UniqueEntityID
}

export interface UserUpdatedProps {
  userId: UniqueEntityID
  old: UserEvent
  new: UserEvent
}

export class UserUpdatedEvent extends DomainEvent<UserUpdatedProps> {}
