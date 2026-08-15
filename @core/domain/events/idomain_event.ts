import { UniqueEntityID } from '../unique_entity_id.js'

export interface IDomainEvent<T = any> {
  dateTimeOccurred: Date
  eventData: T
  eventId: () => UniqueEntityID
}
