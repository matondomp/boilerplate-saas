import { Handler } from '#app/listeners/handler'
import { UserLoggedEvent } from '#modules/auth/domain/events/user_logged_event'
import { BroadcastMessageContract, EmailAdapter } from '#shared/domain/ports/index'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import { SaveNotificationProps } from '#shared/framework/infra/inbox_processor/save_notification_processor'
import { CoreUserModel } from '#shared/framework/infra/index'

export class SendUserLoggedNotificationListener extends Handler {
  constructor(
    private readonly broadcastMessage: BroadcastMessageContract,
    private readonly emailAdapter: EmailAdapter
  ) {
    super()
  }
  async handle(event: UserLoggedEvent): Promise<void> {
    const user = await CoreUserModel.findOrFail(event.eventData.userId.toString())

    await this.broadcastMessage.publish<SaveNotificationProps>('core.shared', {
      type: CoreBroadcastEnum.NOTIFY,
      message: {
        title: 'auth.new_user_login',
        message: 'auth.new_user_login_description',
        content: await this.emailAdapter.render(`${user.defaultLang}/user_logged`, {}),
        routePath: '',
        event: 'USER_LOGGED',
        eventType: 'success',
        notificationType: 'notifications.core.auth.login',
        date: event.dateTimeOccurred,
      },
      meta: {
        userId: event.eventData.userId.toString(),
      },
    })
  }
}
