import { Handler } from '#app/listeners/handler'
import { UserBlockedEvent } from '../../../../domain/events/user_blocked_event.js'

export class LogUserBlockedListener extends Handler {
  async handle(event: UserBlockedEvent): Promise<void> {
    console.log('implement log', event)
  }
}
