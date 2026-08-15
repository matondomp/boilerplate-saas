import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface PasswordChangedProps {
  userId: UniqueEntityID
}

export class PasswordChangedEvent extends DomainEvent<PasswordChangedProps> {}
