import { UniqueEntityID } from '../unique_entity_id.js'
import { IDomainEvent } from './idomain_event.js'

export abstract class DomainEvent<T> implements IDomainEvent {
  readonly eventData: T
  readonly dateTimeOccurred: Date

  constructor(_eventData: T) {
    this.eventData = _eventData
    this.dateTimeOccurred = new Date()
  }

  eventId(): UniqueEntityID {
    return new UniqueEntityID()
  }
}
