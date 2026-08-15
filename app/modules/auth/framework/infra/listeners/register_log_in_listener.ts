import { UserLoggedEvent } from '#modules/auth/domain/events/user_logged_event'
import { CoreUserModel } from '#shared/framework/infra/db/models/index'
import { Handler } from '#app/listeners/handler'
import { DateTime } from 'luxon'
import { LogInterface } from '#shared/domain/interfaces/index'
import { BroadcastMessageContract } from '#shared/domain/ports/broadcast_message_contract'
import { CoreBroadcastEnum } from '#shared/domain/types/index'

export class RegisterLoginListener extends Handler {
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
      loggedAt: DateTime.now().toString(),
    }

    if (!event.eventData.success) {
      delete fullLog['loggedAt']
    }

    this.broadcastMessage.publish<LogInterface>('core.shared.audit.log', {
      type: CoreBroadcastEnum.REGISTER_LOG,
      message: {
        title: 'auth.new_user_login',
        success: event.eventData.success ?? true,
        username: userModel.slug,
        errorMessage: event.eventData.errorMessage?.errorMessage,
        source: 'core.auth',
        summary: 'auth.new_user_login_description',
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
