import { Handler } from '#app/listeners/handler'
import { RoleDeleted } from '#modules/admin/settings/acl/roles_management/domain/events/role_deleted_event'

export class RoleDeletedListener extends Handler {
  handle(event: RoleDeleted): void {
    console.log(event)
  }
}
