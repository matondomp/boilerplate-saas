import { EventDispatcher } from '#core/domain/index'
import { AppSettingModifiedEvent } from '../../domain/index.js'
import { LogAppSettingListener } from '../infra/listeners/app_setting_change.js'
import { NotifyAllUsersThatSettingWasChangedInRealtimeListener } from '../infra/listeners/notify_all_user_that_settings_was_changed.js'

EventDispatcher.getInstance()
  .register(AppSettingModifiedEvent.name, new LogAppSettingListener())
  .register(
    AppSettingModifiedEvent.name,
    new NotifyAllUsersThatSettingWasChangedInRealtimeListener()
  )
