import { UserLoggedEvent } from '#modules/auth/domain/events/user_logged_event'
import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { Handler } from '#app/listeners/handler'
import { LogInterface } from '#shared/domain/interfaces/index'
import { BroadcastMessageContract } from '#shared/domain/ports/broadcast_message_contract'
import { CoreBroadcastEnum } from '#shared/domain/types/index'

export class RegisterLogoutListener extends Handler {
  constructor(private readonly broadcastMessage: BroadcastMessageContract) {
    super()
  }

  override async handle(event: UserLoggedEvent): Promise<void> {
    const userModel = await CoreUserModel.query()
      .where('id', event.eventData.userId.toString())
      .firstOrFail()

    const fullLog: any = {
      username: userModel.slug,
      fullName: userModel.fullName,
      defaultLang: userModel.defaultLang,
    }

    this.broadcastMessage.publish<LogInterface>('core.shared.audit.log', {
      type: CoreBroadcastEnum.REGISTER_LOG,
      message: {
        title: 'auth.user_logout',
        success: true,
        username: userModel.slug,
        source: 'core.auth',
        summary: 'auth.user_logout_description',
        fullLog: fullLog,
        userId: userModel.id,
        createdAt: event.dateTimeOccurred,
      },
      meta: {
        userId: userModel.id,
      },
    })
  }
}
