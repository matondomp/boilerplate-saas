import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface UserRestoredProps {
  userId: UniqueEntityID
}

export class UserRestoredEvent extends DomainEvent<UserRestoredProps> {}
