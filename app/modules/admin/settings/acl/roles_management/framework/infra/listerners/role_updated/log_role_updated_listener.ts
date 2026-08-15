import { Handler } from '#app/listeners/handler'
import { RoleUpdatedEvent } from '#modules/admin/settings/acl/roles_management/domain/events/index'

export class LogRoleUpdatedListener extends Handler {
  async handle(event: RoleUpdatedEvent): Promise<void> {
    console.log('should implement log for this action!', event)
  }
}
