import { Handler } from '#app/listeners/handler'
import { UserUpdatedEvent } from '../../../domain/events/user_updated_event.js'
import { CoreUserModel } from '#shared/framework/infra/index'
import emitter from '@adonisjs/core/services/emitter'

export class UserUpdatedListener extends Handler {
  constructor() {
    super()
  }

  async handle(event: UserUpdatedEvent): Promise<void> {
    const ctx = super.ctx()

    if (!ctx) {
      return
    }

    const user = await CoreUserModel.findOrFail(event.eventData.userId.toString())

    // send a realtime notification
    await emitter.emit('alert:realtime:broadcast:only', {
      users: [user.slug],
      title: ctx.i18n.formatMessage('admin.acl.users.realtime.user.updated'),
      message: ctx.i18n.formatMessage('shared.please_reload_page'),
      type: 'info',
      eventName: 'USER_UPDATED',
    })
  }
}
