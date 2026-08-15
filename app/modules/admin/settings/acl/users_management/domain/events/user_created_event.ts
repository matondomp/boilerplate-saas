import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface UserCreatedProps {
  userId: UniqueEntityID
  password: string
}

export class UserCreatedEvent extends DomainEvent<UserCreatedProps> {}
