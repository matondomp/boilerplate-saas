import { EventDispatcher } from '#core/domain/index'
import { RoleDeleted } from '#modules/admin/settings/acl/roles_management/domain/events/role_deleted_event'

import {
  RoleCreatedListener,
  RoleDeletedListener,
  LogRoleUpdatedListener,
  NotifyAllUsersWithThisRoleInRealtimeListener,
} from '#modules/admin/settings/acl/roles_management/framework/infra/index'

import {
  RoleCreatedEvent,
  RoleUpdatedEvent,
} from '#modules/admin/settings/acl/roles_management/domain/events/index'

EventDispatcher.getInstance()
  .register(RoleDeleted.name, new RoleDeletedListener())
  .register(RoleCreatedEvent.name, new RoleCreatedListener())
  .register(RoleUpdatedEvent.name, new NotifyAllUsersWithThisRoleInRealtimeListener())
  .register(RoleUpdatedEvent.name, new LogRoleUpdatedListener())
