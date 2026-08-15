import { IDomainEvent } from './idomain_event.js'

export interface IHandler<T extends IDomainEvent = IDomainEvent> {
  handle: (event: T) => void
}
