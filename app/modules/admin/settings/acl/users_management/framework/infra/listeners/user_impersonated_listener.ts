import { Handler } from '#app/listeners/handler'
import { UserImpersonatedEvent } from '../../../domain/events/index.js'

export class UserImpersonatedListener extends Handler {
  handle(event: UserImpersonatedEvent): void {
    // do something, like, send e-mail or log

    console.log('UserImpersonatedListener ->', event.eventData)
  }
}
