import { Handler } from '#app/listeners/handler'
import { UserRestoredEvent } from '../../../domain/events/user_restored_event.js'

export class UserRestoredListener extends Handler {
  handle(event: UserRestoredEvent): void {
    // do something, like, send e_mail or log

    console.log(event.eventData)
  }
}
