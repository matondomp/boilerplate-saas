import { EventDispatcher } from '#core/domain/index'
import { DomainActionExecutedEvent } from '../../domain/events/domain_action_executed_event.js'
import { SaveLogListener } from '../infra/listeners/save_log_listener.js'
import { BroadcastMessageRepositoryImpl } from '#shared/framework/infra/db/repositories/broadcast_message_repository_impl'

EventDispatcher.getInstance().register(
  DomainActionExecutedEvent.name,
  new SaveLogListener(new BroadcastMessageRepositoryImpl())
)
