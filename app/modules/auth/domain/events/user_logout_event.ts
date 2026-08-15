import { IDomainEvent, UniqueEntityID } from '#core/domain/index'

interface UserLogoutProps {
  userId: UniqueEntityID
}

export class UserLogoutEvent implements IDomainEvent<UserLogoutProps> {
  dateTimeOccurred: Date

  readonly eventData: UserLogoutProps
  constructor(protected readonly _eventData: UserLogoutProps) {
    this.dateTimeOccurred = new Date()
    this.eventData = _eventData
  }

  eventId(): UniqueEntityID {
    return new UniqueEntityID()
  }
}
