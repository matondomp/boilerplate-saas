import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface UserImpersonatedEventProp {
  userId: UniqueEntityID
}

export class UserImpersonatedEvent extends DomainEvent<UserImpersonatedEventProp> {}
