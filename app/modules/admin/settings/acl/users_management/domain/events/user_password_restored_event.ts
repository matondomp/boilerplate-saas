import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface UserPasswordRestoredProps {
  userId: UniqueEntityID
}

export class UserPasswordRestoredEvent extends DomainEvent<UserPasswordRestoredProps> {}
