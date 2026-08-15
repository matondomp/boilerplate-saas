import {
  UserCreatedEvent,
  UserDeletedEvent,
  UserBlockedEvent,
  UserUpdatedEvent,
  UserRestoredEvent,
  UserPasswordRestoredEvent,
  UserImpersonatedEvent,
} from '../../domain/events/index.js'
import { EventDispatcher } from '#core/domain/index'
import {
  UserUpdatedListener,
  UserCreatedListener,
  UserDeletedListener,
  UserRestoredListener,
  LogUserBlockedListener,
  UserPasswordRestoredListener,
  SendEmailToBlockedUserListener,
  EmitRealtimeMessageToBlockedUserListener,
  LogUserCreatedListener,
} from '#modules/admin/settings/acl/users_management/framework/infra/listeners/index'
import { BroadcastMessageRepositoryImpl } from '#shared/framework/infra/index'
import { UserImpersonatedListener } from '../infra/listeners/user_impersonated_listener.js'
import { EmailAdapterImpl } from '#shared/framework/infra/adapters/email_adapter_impl'
import { resolve } from 'node:path'

const broadcastMessage = new BroadcastMessageRepositoryImpl()

EventDispatcher.getInstance()
  .register(
    UserCreatedEvent.name,
    new UserCreatedListener(
      broadcastMessage,
      new EmailAdapterImpl(resolve(import.meta.dirname, '..', 'infra/resources'))
    )
  )
  .register(UserCreatedEvent.name, new LogUserCreatedListener(broadcastMessage))
  .register(UserDeletedEvent.name, new UserDeletedListener())
  .register(UserRestoredEvent.name, new UserRestoredListener())
  .register(UserBlockedEvent.name, new SendEmailToBlockedUserListener(broadcastMessage))
  .register(UserBlockedEvent.name, new LogUserBlockedListener())
  .register(UserBlockedEvent.name, new EmitRealtimeMessageToBlockedUserListener())
  .register(UserPasswordRestoredEvent.name, new UserPasswordRestoredListener())
  .register(UserUpdatedEvent.name, new UserUpdatedListener())
  .register(UserImpersonatedEvent.name, new UserImpersonatedListener())
