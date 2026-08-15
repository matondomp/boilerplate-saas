import { Handler } from '#app/listeners/handler'
import emitter from '@adonisjs/core/services/emitter'

export class NotifyAllUsersThatSettingWasChangedInRealtimeListener extends Handler {
  async handle(): Promise<void> {
    const ctx = super.ctx()

    if (!ctx) {
      return
    }

    void emitter.emit('alert:realtime:broadcast:all', {
      title: ctx.i18n.formatMessage('admin.application.settings.updated'),
      message: ctx.i18n.formatMessage('admin.application.settings.description'),
      type: 'info',
      eventName: 'SETTINGS_UPDATED',
      icon: 'message',
    })
  }
}
