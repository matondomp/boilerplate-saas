import { SendPasswordChangedEmailListener } from './../infra/listeners/send_password_changed_email_listener.js'
import { EventDispatcher } from '#core/domain/index'
import { PasswordChangedEvent } from '../../domain/events/password_changed_event.js'
import { BroadcastMessageRepositoryImpl } from '../infra/index.js'
import { RegisterPasswordChangedListener } from '../infra/listeners/register_password_changed_listener.js'
import { EmailAdapterImpl } from '../infra/adapters/email_adapter_impl.js'
import { resolve } from 'node:path'

EventDispatcher.getInstance()
  .register(
    PasswordChangedEvent.name,
    new RegisterPasswordChangedListener(new BroadcastMessageRepositoryImpl())
  )
  .register(
    PasswordChangedEvent.name,
    new SendPasswordChangedEmailListener(
      new BroadcastMessageRepositoryImpl(),
      new EmailAdapterImpl(resolve(import.meta.dirname, '..', 'infra/resources'))
    )
  )
