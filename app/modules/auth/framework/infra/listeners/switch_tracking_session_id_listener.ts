import { Handler } from '#app/listeners/handler'
import { UniqueEntityID } from '#core/domain/index'
import { UserLoggedEvent } from '#modules/auth/domain/events/user_logged_event'

export class SwitchTrackingSessionIdListener extends Handler {
  async handle(event: UserLoggedEvent): Promise<void> {
    const ctx = super.ctx()

    if (!ctx) {
      throw new Error('No ctx')
    }

    ctx.session.put(
      'x_track_id',
      `${new UniqueEntityID().toString()}_${event.dateTimeOccurred.getTime()}`
    )
  }
}
