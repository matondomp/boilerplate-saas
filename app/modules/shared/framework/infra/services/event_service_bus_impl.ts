import emitter from '@adonisjs/core/services/emitter'
import { Message, MessageBus } from '#shared/domain/ports/message_bus'

export class EventServiceBusImpl implements MessageBus {
  private static instance: EventServiceBusImpl

  private readonly eventPrefix = 'outbox_exchange'

  async start(): Promise<void> {
    // don't needed
  }

  async publish(routingKey: string, message: Message): Promise<void> {
    emitter.emit<any>(`${this.eventPrefix}:${routingKey}`, message)
  }

  async consume(
    bindingKey: string,
    onMessage: (message: Message, ack: () => void) => Promise<void>
  ): Promise<void> {
    const queueName = bindingKey

    emitter.on<any, any>(`${this.eventPrefix}:${queueName}`, (msg) => onMessage(msg, () => {}))
  }

  stop() {
    // don't needed
  }

  static getInstance(): EventServiceBusImpl {
    if (!this.instance) {
      this.instance = new EventServiceBusImpl()
    }

    return this.instance
  }
}
