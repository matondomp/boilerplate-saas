import { Handler } from '#app/listeners/handler'
import { CoreRoleModel } from '#shared/framework/infra/db/models/index'
import emitter from '@adonisjs/core/services/emitter'
import { RoleUpdatedEvent } from '#modules/admin/settings/acl/roles_management/domain/events/index'

export class NotifyAllUsersWithThisRoleInRealtimeListener extends Handler {
  async handle(event: RoleUpdatedEvent): Promise<void> {
    const role = await CoreRoleModel.query()
      .preload('users')
      .where('id', event.eventData.roleId.toString())
      .firstOrFail()

    const ctx = super.ctx()

    if (!ctx) {
      return
    }

    void emitter.emit('alert:realtime:broadcast:only', {
      users: role.users.map((u) => u.slug),
      title: ctx.i18n.formatMessage('admin.acl.role.updated'),
      message: ctx.i18n.formatMessage('admin.acl.role.updated-description'),
      type: 'info',
      eventName: 'ROLE_UPDATED',
      icon: 'message',
    })
  }
}
