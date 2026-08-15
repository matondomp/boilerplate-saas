import { Entity } from './entity.js'
import { IDomainEvent } from './events/idomain_event.js'
import { UniqueEntityID } from './unique_entity_id.js'

export abstract class AggregateRoot<T> extends Entity<T> {
  private readonly _domainEvents: IDomainEvent[] = []

  get id(): UniqueEntityID {
    return this._id
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent)
    // DomainEvents.markAggregateForDispatch(this)
    this.logDomainEventAdded(domainEvent)
  }

  clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length)
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this)
    const domainEventClass = Reflect.getPrototypeOf(domainEvent)
    console.info(
      '[Domain Event Created]:',
      thisClass?.constructor.name,
      '==>',
      domainEventClass?.constructor.name
    )
  }
}
