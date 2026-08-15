import { resolve } from 'node:path'
import { EventDispatcher } from '#core/domain/index'
import { UserLoggedEvent } from '#modules/auth/domain/events/user_logged_event'
import { FindUserIdRepositoryImpl } from '#modules/auth/framework/infra/db/repositories/index'
import {
  SendUserLoggedNotificationListener,
  SetUserLatestLoginListener,
} from '#modules/auth/framework/infra/listeners/index'
import { BroadcastMessageRepositoryImpl } from '#shared/framework/infra/index'
import { EmailAdapterImpl } from '#shared/framework/infra/adapters/email_adapter_impl'

import { getCurrentDir } from '#start/utils/current_dir'
import { RegisterLoginListener } from '../infra/listeners/register_log_in_listener.js'
import { UserLogoutEvent } from '../../domain/events/user_logout_event.js'
import { RegisterLogoutListener } from '../infra/listeners/register_logout_listener.js'
import { SwitchTrackingSessionIdListener } from '../infra/listeners/switch_tracking_session_id_listener.js'
import { RegisterSendResetPasswordEmailListener } from '../infra/listeners/register_send_reset_password_email_listener.js'
import { SentResetPasswordEvent } from '../../domain/events/sent_reset_password_event.js'

const broadcast = new BroadcastMessageRepositoryImpl()

EventDispatcher.getInstance()
  .register(UserLoggedEvent.name, new SetUserLatestLoginListener(new FindUserIdRepositoryImpl()))
  .register(
    UserLoggedEvent.name,
    new SendUserLoggedNotificationListener(
      broadcast,
      new EmailAdapterImpl(resolve(getCurrentDir(import.meta.url), '..', 'infra/resources'))
    )
  )
  .register(UserLoggedEvent.name, new RegisterLoginListener(broadcast))
  .register(UserLogoutEvent.name, new RegisterLogoutListener(broadcast))
  .register(UserLogoutEvent.name, new SwitchTrackingSessionIdListener())
  .register(SentResetPasswordEvent.name, new RegisterSendResetPasswordEmailListener(broadcast))
