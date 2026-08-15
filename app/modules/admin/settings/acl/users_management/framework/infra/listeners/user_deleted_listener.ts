import { Handler } from '#app/listeners/handler'
import { UserDeletedEvent } from '../../../domain/events/user_deleted_event.js'
export class UserDeletedListener extends Handler {
  handle(event: UserDeletedEvent): void {
    // do something, like, send e_mail or log

    console.log(event.eventData)
  }
}
