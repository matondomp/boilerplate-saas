import { Handler } from '#app/listeners/handler'
import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import emitter from '@adonisjs/core/services/emitter'
import { UserBlockedEvent } from '../../../../domain/events/user_blocked_event.js'

export class EmitRealtimeMessageToBlockedUserListener extends Handler {
  async handle(event: UserBlockedEvent): Promise<void> {
    const ctx = super.ctx()

    if (!ctx) {
      return
    }

    const user = await CoreUserModel.findOrFail(event.eventData.userId.toString())
    const adminUser = await CoreUserModel.findOrFail(ctx.auth.user?.id)

    await emitter.emit('alert:realtime:broadcast:only', {
      users: [user.slug],
      message: ctx.i18n.formatMessage('admin.acl.users.realtime.user.blocked_description', {
        adminName: adminUser.fullName,
      }),
      title: ctx.i18n.formatMessage('admin.acl.users.realtime.user.blocked'),
      type: 'error',
      eventName: 'USER_BLOCKED',
    })
  }
}
