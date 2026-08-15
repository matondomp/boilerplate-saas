import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface UserDeletedProps {
  userId: UniqueEntityID
  motivation?: string
}

export class UserDeletedEvent extends DomainEvent<UserDeletedProps> {}
