import { EventDispatcher } from '#core/domain/index'
import { NotificationsUpdatedEvent, UserInfoUpdatedEvent } from '#modules/admin/common/domain/index'
import {
  NotificationsUpdatedListener,
  UserInfoUpdatedListener,
} from '#modules/admin/common/framework/infra/index'

EventDispatcher.getInstance()
  .register(NotificationsUpdatedEvent.name, new NotificationsUpdatedListener())
  .register(UserInfoUpdatedEvent.name, new UserInfoUpdatedListener())
