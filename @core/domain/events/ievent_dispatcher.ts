import { IDomainEvent } from './idomain_event.js'
import { IHandler } from './ihandler.js'

export interface IEventDispatcher {
  eventHandlers(): any
  publish: <T extends IDomainEvent>(event: T) => void
  register: <T extends IDomainEvent>(eventName: string, handler: IHandler<T>) => void
  unregister: <T extends IDomainEvent>(eventName: string, handler: IHandler<T>) => void
  unregisterAll: () => void
}
