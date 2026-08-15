import { RoleCreatedEvent } from '#modules/admin/settings/acl/roles_management/domain/events/index'
import Logger from '@adonisjs/core/services/logger'
import { Handler } from '#app/listeners/handler'

export class RoleCreatedListener extends Handler {
  handle(event: RoleCreatedEvent): void {
    Logger.info(`Nova Role Criada ${event.eventData.roleId.toString()}`)
  }
}
