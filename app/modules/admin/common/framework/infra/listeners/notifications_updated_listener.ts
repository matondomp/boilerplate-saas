import { Handler } from '#app/listeners/handler'
import { NotificationsUpdatedEvent } from '#modules/admin/common/domain/index'

export class NotificationsUpdatedListener extends Handler {
  handle(event: NotificationsUpdatedEvent): void {
    console.log(event)
  }
}
