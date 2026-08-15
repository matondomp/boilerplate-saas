import { IEventDispatcher, IHandler, IDomainEvent } from '../index.js'

interface IEventHandlers {
  [eventName: string]: Array<IHandler<IDomainEvent>>
}

export class EventDispatcher implements IEventDispatcher {
  private _eventHandlers: IEventHandlers = {}
  private static instance: EventDispatcher

  eventHandlers(): IEventHandlers {
    return this._eventHandlers
  }

  publish<T>(event: T): void {
    const eventName = (event as any).constructor.name
    if (this._eventHandlers[eventName]) {
      this._eventHandlers[eventName].forEach((eventHandler) => eventHandler.handle(event as any))
    }
  }

  register<T extends IDomainEvent<any>>(eventName: string, handler: IHandler<T>): EventDispatcher {
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = []
    }
    this._eventHandlers[eventName].push(handler as any)

    return this
  }

  unregister<T extends IDomainEvent<any>>(
    eventName: string,
    handler: IHandler<T>
  ): EventDispatcher {
    if (this._eventHandlers[eventName]) {
      const index = this._eventHandlers[eventName].indexOf(handler as any)
      if (index > -1) {
        this._eventHandlers[eventName].splice(index, 1)
      }
    }
    return this
  }

  unregisterAll(): EventDispatcher {
    this._eventHandlers = {}
    return this
  }

  static getInstance(): EventDispatcher {
    if (!this.instance) {
      this.instance = new EventDispatcher()
    }

    return this.instance
  }
}
