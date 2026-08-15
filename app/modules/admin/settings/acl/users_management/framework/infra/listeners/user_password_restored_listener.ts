import { Handler } from '#app/listeners/handler'
import { UserPasswordRestoredEvent } from '../../../domain/events/user_password_restored_event.js'

export class UserPasswordRestoredListener extends Handler {
  handle(event: UserPasswordRestoredEvent): void {
    // do something, like, send e_mail or log

    console.log(event.eventData)
  }
}
