import { IDomainEvent, UniqueEntityID } from '#core/domain/index'

interface SentResetPasswordEventProps {
  userId: UniqueEntityID
}

export class SentResetPasswordEvent implements IDomainEvent<SentResetPasswordEventProps> {
  dateTimeOccurred: Date

  readonly eventData: SentResetPasswordEventProps
  constructor(protected readonly _eventData: SentResetPasswordEventProps) {
    this.dateTimeOccurred = new Date()
    this.eventData = _eventData
  }

  eventId(): UniqueEntityID {
    return new UniqueEntityID()
  }
}
