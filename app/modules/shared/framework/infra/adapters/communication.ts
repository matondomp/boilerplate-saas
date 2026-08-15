import { MessageBus } from '../../../domain/ports/message_bus.js'
import { EventServiceBusImpl } from '../services/event_service_bus_impl.js'

const Communication: { broker: MessageBus } = {
  broker: EventServiceBusImpl.getInstance(),
}

export default Communication
