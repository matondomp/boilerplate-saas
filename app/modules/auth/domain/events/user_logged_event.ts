import { DomainError, IDomainEvent, Result, UniqueEntityID } from '#core/domain/index'

interface UserLoggedProps {
  userId: UniqueEntityID
  success?: boolean
  errorMessage?: Result<DomainError>
}

export class UserLoggedEvent implements IDomainEvent<UserLoggedProps> {
  dateTimeOccurred: Date

  readonly eventData: UserLoggedProps
  constructor(protected readonly _eventData: UserLoggedProps) {
    this.dateTimeOccurred = new Date()
    this.eventData = _eventData
  }

  eventId(): UniqueEntityID {
    return new UniqueEntityID()
  }
}
